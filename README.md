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

The site is built around concise engineering signals, and every factual claim traces to a source document (resume, poster, report, or signed form):

- CARNATIONS Lab (Dr. Mathieu Joerger) UWB collaborative navigation: 3-link relative-pose estimator (81/81 frames, 5.99 cm RMSE), 7,553-sample SS-TWR calibration (8.9 to 3.7 cm), 30 m to 100 m firmware range extension, Dennis Dean conference presentation
- Caterpillar embedded controls co-op (kept public-safe: no program identifiers) and GTMS thermal/CFD internship
- ACSL three-DOF thrust stand under the NAVAIR Fellowship: 28.7% mass reduction, ROS 2/Dynamixel moment cancellation, AirTalent Symposium presentation at NAVAIR Patuxent River
- GoAERO avionics leadership with the $30K NASA University Innovation Prize
- Accelerated B.S./M.S.: B.S. May 2027, thesis M.S. expected 2028, GPA 3.90

Old URLs (`experience.html`, `experience/caterpillar_coop.html`, `research/*.html` stubs) are instant meta-refresh redirects to their consolidated pages.

See `docs/website_research_notes.md` for the research notes behind the redesign.
