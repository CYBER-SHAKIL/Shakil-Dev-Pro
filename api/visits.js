import { getDatabase } from '../server/utils/firebase-admin.js';
import { onlyMethod, sendJson } from '../server/utils/validation.js';

export default async function handler(req, res) {
  if (!onlyMethod(req, res, 'GET')) return;
  try {
    const ref = getDatabase().ref('publicStats/totalVisits');
    await ref.transaction(value => (Number.isSafeInteger(value) && value >= 0 ? value : 0) + 1);
    const snapshot = await ref.get();
    return sendJson(res, 200, { totalVisits: Number(snapshot.val()) || 0 });
  } catch (error) {
    console.error('Visits endpoint error:', error.code || error.message);
    return sendJson(res, 503, { error: 'Visit counter is temporarily unavailable.' });
  }
}
