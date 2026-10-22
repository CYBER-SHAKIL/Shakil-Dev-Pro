# Shakil Official Portfolio

Portfolio frontend with Vercel serverless API routes. The existing HTML layout and styling rules have been moved into external CSS files while retaining their cascade order. Browser behavior is split into focused JavaScript modules.

## Project structure

- `index.html` — portfolio markup
- `assets/` — static images, icons and fonts
- `css/main.css` — global/layout styles, with responsive and animation rules kept in their original cascade groups
- `css/components.css` — join/subscribe modal styles
- `css/chatbot.css` — chatbot overrides, loaded last
- `js/animations.js`, `js/theme.js`, `js/navigation.js`, `js/projects.js`, `js/chatbot.js`, `js/api-client.js` — browser-side modules
- `js/main.js` — page initialization and video viewer behavior
- `api/` — Vercel serverless endpoints
- `server/services/` — AI and public project data logic
- `server/utils/` — validation and Firebase Admin setup
- `config/firebase-client.js` — public Firebase web configuration only

## Required Vercel environment variables

In Vercel → Project → Settings → Environment Variables, configure these for Production (and Preview if desired):

- `GEMINI_API_KEY`: Gemini API key from Google AI Studio. This remains server-side.
- `FIREBASE_PROJECT_ID`: `shakil-dev-pro`
- `FIREBASE_DATABASE_URL`: `https://shakil-dev-pro-default-rtdb.asia-southeast1.firebasedatabase.app`
- `FIREBASE_SERVICE_ACCOUNT_JSON`: Firebase service-account JSON as a single-line JSON value, with the necessary Realtime Database access.

`.env.example` documents variable names only. Do not commit real keys, private keys or `.env` files. The Firebase web API key in `config/firebase-client.js` is public client configuration, not an Admin credential; protect the project with Firebase API restrictions and appropriate database rules.

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
