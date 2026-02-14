# Malhar Portfolio Site

Personal portfolio site for Malhar Mahajan focused on aerospace controls, avionics, and UAV autonomy.

## Quick Start (Frontend)

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Backend: What You Need To Make It Work

The contact page sends requests to:

- `https://malhar-portfolio-server.onrender.com/send-email`

If you want your own reliable backend (recommended), do this:

### 1) Create a small API service

Use Node + Express (or Fastify) with one route:

- `POST /send-email`

Expected payload:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "subject": "Subject",
  "message": "Message"
}
```

### 2) Add email delivery provider

Common options:

- Resend
- SendGrid
- AWS SES

Store provider API keys in environment variables (never in Git).

### 3) Add anti-spam and reliability basics

- Honeypot field (hidden input)
- Rate limit by IP
- Basic payload validation (required fields + valid email format)
- Structured error responses for the frontend
- Logging for failed sends

### 4) Update the frontend endpoint

In `script.js`, update `EMAIL_API` to your backend URL.

Example:

```js
const EMAIL_API = "https://your-api-domain.com/send-email";
```

### 5) Deploy backend

Deploy on Render, Railway, Fly.io, or AWS.

### 6) Verify end-to-end

- Submit contact form on `contact.html`
- Confirm 2xx response in browser network tab
- Confirm email arrived in inbox
- Confirm spam protection works

## Recruiter-Focused Content Areas Included

- Controls + embedded systems impact from Caterpillar rotations
- NAVAIR thrust-stand renovation and GNC tuning work
- UWB cross-collaboration section with AVA Lab (Dr. Joerger)
- Strong internship call-to-action and resume/contact CTA in hero
