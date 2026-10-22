import { getDatabase } from '../server/utils/firebase-admin.js';
import { cleanText, onlyMethod, readJsonBody, sendJson } from '../server/utils/validation.js';

export default async function handler(req, res) {
  if (!onlyMethod(req, res, 'POST')) return;
  try {
    const body = await readJsonBody(req);
    const name = cleanText(body.name, 80);
    const email = cleanText(body.email, 254).toLowerCase();
    const message = cleanText(body.message, 4000);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
      return sendJson(res, 400, { error: 'Please provide a name, valid email, and a message of at least 10 characters.' });
    }
    const db = getDatabase();
    const ref = db.ref('contactMessages').push();
    await ref.set({ name, email, message, createdAt: Date.now(), status: 'new' });
    return sendJson(res, 201, { ok: true, message: 'Message received.' });
  } catch (error) {
    console.error('Contact endpoint error:', error.code || error.message);
    return sendJson(res, error.statusCode || 503, { error: 'Unable to send your message right now.' });
  }
}
