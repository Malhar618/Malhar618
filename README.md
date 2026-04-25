# Malhar Mahajan Portfolio

Personal engineering portfolio for GNC, embedded controls, autonomous systems, and vehicle simulation roles.

## Run Locally

```bash
npm start
```

Open `http://localhost:8080`.

The backend is intentionally dependency-free Node.js:

- `GET /api/health` returns service status.
- `POST /api/contact` validates contact form payloads, applies a small in-memory rate limit, rejects honeypot spam, stores messages in `data/contact-messages.jsonl`, and optionally sends email through Resend.

## Optional Email Delivery

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

`CONTACT_TO` defaults to `malhar05@vt.edu`. Without `RESEND_API_KEY`, the server returns a clear email-not-configured response and the contact page offers a prefilled email draft link instead of claiming the message was sent.

## Content Strategy

The site is built around concise engineering signals:

- Caterpillar embedded controls and GTMS simulation rotations
- AVA Lab / CARNATIONS UWB collaborative navigation with Dr. Mathieu Joerger
- NAVAIR/ACSL three-DOF thrust stand with ROS 2, Pixhawk/Odroid, and Dynamixel integration
- Autonomous UAV and GoAERO avionics leadership

See `docs/website_research_notes.md` for the research notes behind the redesign.
