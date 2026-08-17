# Development notes

This repo doubles as the GitHub profile README and the portfolio site deployed to GitHub Pages at https://malhar618.github.io/Malhar618/.

## Run locally

```bash
npm start
```

Open `http://localhost:8080` (or set `PORT`).

The backend is dependency-free Node.js:

- `GET /api/health` returns service status.
- `POST /api/contact` validates contact form payloads, applies a small in-memory rate limit, rejects honeypot spam, stores messages in `data/contact-messages.jsonl`, and optionally sends email through Resend.
- Static serving blocks dotfiles, `data/`, `node_modules/`, and server source (case-insensitively), and resolves extensionless URLs (`/contact` → `contact.html`) to match GitHub Pages behavior.

On GitHub Pages there is no backend; the contact form falls back to a pre-filled `mailto:` draft.

## Optional email delivery (local only)

Copy `.env.example` to `.env`, add a Resend API key, then restart the server:

```bash
cp .env.example .env
```

Required values:

```bash
RESEND_API_KEY=re_...
CONTACT_TO=malhar05@vt.edu
CONTACT_FROM="Portfolio <verified-sender@example.com>"
```

Without `RESEND_API_KEY`, the server returns an email-not-configured response and the contact page offers a prefilled email draft link instead of claiming the message was sent.

## Content rules

Every factual claim on the site traces to a source document (resume, poster, NAVAIR Fellowship report, signed accelerated-degree form). Caterpillar content stays public-safe: no program identifiers. Old URLs (`experience.html`, `experience/caterpillar_coop.html`, `research/*.html` stubs) are instant meta-refresh redirects to their consolidated pages.

See `docs/website_research_notes.md` for the research notes behind the redesign.
