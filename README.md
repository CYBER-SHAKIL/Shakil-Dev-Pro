# Shakil Official Portfolio

Portfolio frontend with Vercel serverless API routes. The existing HTML layout and visual styling are intentionally retained while the AI and data features are moved toward server-side handling.

## Project structure

- `index.html` — original portfolio markup and currently retained inline CSS
- `assets/` — static image, icon and font directories
- `css/` — stylesheet migration notes; CSS extraction is deferred to avoid changing the current visual output
- `js/main.js` — existing browser interactions, now calls the server AI and visits endpoints
- `js/join-modal.js`, `js/image-fallback.js` — extracted browser scripts
- `api/` — Vercel serverless endpoints
- `server/services/` — AI and public project data logic
- `server/utils/` — validation and Firebase Admin initialization
- `config/firebase-client.js` — public Firebase web configuration only

## Required Vercel environment variables

In Vercel → Project → Settings → Environment Variables, configure these for Production (and Preview if desired):

- `GEMINI_API_KEY`: Gemini API key from Google AI Studio. This remains server-side.
- `FIREBASE_PROJECT_ID`: `shakil-dev-pro`
- `FIREBASE_DATABASE_URL`: `https://shakil-dev-pro-default-rtdb.asia-southeast1.firebasedatabase.app`
- `FIREBASE_SERVICE_ACCOUNT_JSON`: Firebase service-account JSON as a single-line JSON value, with the necessary Realtime Database access.

`.env.example` documents the variable names only. Do not commit real keys, private keys or `.env` files. The Firebase web API key in `config/firebase-client.js` is public client configuration, not an Admin credential; protect the project with Firebase API restrictions and appropriate database rules.

## API endpoints

- `POST /api/ai` — server-side Gemini response. Body: `{ "message": "...", "history": [{ "role": "user" | "model", "text": "..." }] }`.
- `GET /api/projects` — public project catalogue.
- `POST /api/contact` — validates and stores contact messages at Firebase Realtime Database `contactMessages`.
- `GET /api/visits` — atomically increments and returns `publicStats/totalVisits`.

## Local development

```sh
npm install
npm run check
npx vercel dev
``

The AI endpoint needs `GEMINI_API_KEY`; contact and visit endpoints need Firebase Admin credentials. Until these are configured in the deployment environment, those features return safe errors. Public write endpoints should have rate limiting or bot protection before broad production traffic. Repository changes do not by themselves configure Vercel secrets or prove a live deployment.
