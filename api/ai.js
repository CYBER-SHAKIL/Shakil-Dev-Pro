import { generateAssistantReply } from '../server/services/ai-service.js';
import { cleanText, onlyMethod, readJsonBody, sendJson } from '../server/utils/validation.js';

export default async function handler(req, res) {
  if (!onlyMethod(req, res, 'POST')) return;
  try {
    const body = await readJsonBody(req);
    const message = cleanText(body.message, 2000);
    if (!message) return sendJson(res, 400, { error: 'Message is required.' });
    if (message.length < 1) return sendJson(res, 400, { error: 'Message is empty.' });
    const history = Array.isArray(body.history) ? body.history : [];
    const reply = await generateAssistantReply(message, history);
    return sendJson(res, 200, { reply });
  } catch (error) {
    const status = error.statusCode || 500;
    if (status >= 500) console.error('AI endpoint error:', error.code || error.message);
    return sendJson(res, status, {
      error: status === 503 ? 'AI service is not configured yet.' :
        status === 429 ? 'AI request limit reached. Please try again later.' :
        status === 400 ? 'Invalid request.' : 'AI is temporarily unavailable.',
      code: error.code || undefined
    });
  }
}
