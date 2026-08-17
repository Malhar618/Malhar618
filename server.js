const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const MESSAGE_LOG = path.join(DATA_DIR, "contact-messages.jsonl");
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 6;
const DEFAULT_CONTACT_TO = "malhar05@vt.edu";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".svg", "image/svg+xml"],
  [".mov", "video/quicktime"],
  [".mp4", "video/mp4"],
  [".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  [".md", "text/markdown; charset=utf-8"],
]);

const rateBuckets = new Map();

async function loadDotEnv() {
  const envPath = path.join(ROOT, ".env");
  let raw;
  try {
    raw = await fs.readFile(envPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") console.error(error);
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (!key || process.env[key] !== undefined) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function getClientKey(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return (ip || req.socket.remoteAddress || "unknown").trim();
}

function isRateLimited(key) {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || [];
  const recent = bucket.filter((stamp) => now - stamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(key, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(key, recent);
  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function validatePayload(payload) {
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();
  const company = String(payload.company || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (company) return { ok: false, message: "Spam check failed." };
  if (!name || !email || !subject || !message) return { ok: false, message: "All fields are required." };
  if (!emailPattern.test(email)) return { ok: false, message: "Enter a valid email address." };
  if (name.length > 120 || email.length > 180 || subject.length > 180 || message.length > 4000) {
    return { ok: false, message: "Message is too long." };
  }

  return { ok: true, value: { name, email, subject, message } };
}

async function storeMessage(message, req) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ipHash: crypto.createHash("sha256").update(getClientKey(req)).digest("hex").slice(0, 16),
    userAgent: req.headers["user-agent"] || "",
    ...message,
  };
  await fs.appendFile(MESSAGE_LOG, `${JSON.stringify(record)}\n`, "utf8");
  return record.id;
}

async function maybeSendEmail(message) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || process.env.RESEND_TO || DEFAULT_CONTACT_TO;
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    return { sent: false, reason: "missing_resend_api_key" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: message.email,
      subject: `Portfolio contact: ${message.subject}`,
      text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend failed: ${response.status} ${text}`);
  }

  const data = await response.json().catch(() => ({}));
  return { sent: true, providerId: data.id || null };
}

async function handleContact(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Method not allowed." });
    return;
  }

  const key = getClientKey(req);
  if (isRateLimited(key)) {
    sendJson(res, 429, { message: "Too many contact attempts. Try again later." });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    sendJson(res, 400, { message: "Invalid JSON payload." });
    return;
  }

  const validated = validatePayload(payload);
  if (!validated.ok) {
    sendJson(res, 400, { message: validated.message });
    return;
  }

  try {
    const id = await storeMessage(validated.value, req);
    let delivery = { sent: false, reason: "unknown" };
    try {
      delivery = await maybeSendEmail(validated.value);
    } catch (error) {
      console.error(error);
      delivery = { sent: false, reason: "provider_error" };
    }
    const status = delivery.sent ? 200 : 503;
    sendJson(res, status, {
      message: delivery.sent
        ? "Message sent."
        : "Email delivery is not configured. Use the direct email link.",
      id,
      emailSent: delivery.sent,
      emailReason: delivery.reason || null,
    });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { message: "Could not save message." });
  }
}

function safeStaticPath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const requested = normalized === "/" ? "/index.html" : normalized;
  const filePath = path.join(ROOT, requested);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return null;

  // Windows resolves paths case-insensitively, so compare lowercased segments.
  const segments = path.relative(ROOT, filePath).split(path.sep).map((s) => s.toLowerCase());
  const blockedDirs = new Set(["data", "node_modules"]);
  const blockedFiles = new Set(["server.js", "package.json", "package-lock.json"]);
  if (segments.some((segment) => segment.startsWith("."))) return null;
  if (segments.length && blockedDirs.has(segments[0])) return null;
  if (segments.length === 1 && blockedFiles.has(segments[0])) return null;

  return filePath;
}

async function serveStatic(req, res) {
  const filePath = safeStaticPath(req.url || "/");
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch (error) {
      // Extensionless URLs (e.g. /contact) resolve to their .html file,
      // matching GitHub Pages behavior in production.
      if (error.code === "ENOENT" && !path.extname(filePath)) {
        stat = await fs.stat(`${filePath}.html`);
        req.url = `${(req.url || "").split("?")[0]}.html`;
        await serveStatic(req, res);
        return;
      }
      throw error;
    }
    if (stat.isDirectory()) {
      req.url = `${req.url?.replace(/\/$/, "")}/index.html`;
      await serveStatic(req, res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const body = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes.get(ext) || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
    res.end(body);
  } catch (error) {
    if (error.code !== "ENOENT") console.error(error);
    const notFound = path.join(ROOT, "index.html");
    const body = await fs.readFile(notFound);
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": body.length });
    res.end(body);
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if ((req.url || "").split("?")[0] === "/favicon.ico") {
      res.writeHead(204, { "Cache-Control": "public, max-age=86400" });
      res.end();
      return;
    }

    if (req.url === "/api/contact") {
      await handleContact(req, res);
      return;
    }

    await serveStatic(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500);
    res.end("Internal server error");
  }
});

loadDotEnv().then(() => {
  server.listen(PORT, () => {
    const emailStatus = process.env.RESEND_API_KEY ? "enabled" : "not configured";
    console.log(`Portfolio server running at http://localhost:${PORT}`);
    console.log(`Contact email delivery: ${emailStatus}`);
  });
});
