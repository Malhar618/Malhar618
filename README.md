# Malhar Mahajan Portfolio

Recruiter-facing portfolio for GNC, embedded controls, autonomous systems, and vehicle simulation roles.

## Run Locally

```bash
npm start
```

Open `http://localhost:8080`.

The backend is intentionally dependency-free Node.js:

- `GET /api/health` returns service status.
- `POST /api/contact` validates contact form payloads, applies a small in-memory rate limit, rejects honeypot spam, stores messages in `data/contact-messages.jsonl`, and optionally sends email through Resend.

## Optional Email Delivery

Set these environment variables before running the server:

```bash
RESEND_API_KEY=...
CONTACT_TO=malhar05@vt.edu
CONTACT_FROM="Portfolio <verified-sender@example.com>"
```

Without those variables, the form still works locally and stores validated messages.

## Content Strategy

The site is built around fast recruiter scanning and source-backed engineering signals:

- Caterpillar embedded controls and GTMS simulation rotations
- UWB collaborative navigation and calibrated ranging results
- NAVAIR/ACSL three-DOF thrust stand with ROS 2, Pixhawk/Odroid, and Dynamixel integration
- Autonomous UAV and GoAERO avionics leadership

See `docs/website_research_notes.md` for the research notes behind the redesign.
