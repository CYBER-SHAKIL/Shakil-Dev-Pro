import { getDatabase } from '../server/utils/firebase-admin.js';
import { onlyMethod, sendJson } from '../server/utils/validation.js';

export default async function handler(req, res) {
  if (!onlyMethod(req, res, 'GET')) return;
  try {
    const snapshot = await getDatabase().ref('portfolioContent/videos').once('value');
    const saved = snapshot.val() || {};
    const videos = Object.entries(saved).map(([id, item]) => ({
      id, title: item.title || 'Video', url: item.url || '',
      image: item.image || '', description: item.description || ''
    })).filter(item => item.url);
    return sendJson(res, 200, { videos });
  } catch (error) {
    console.error('Dynamic videos unavailable:', error.message);
    return sendJson(res, 200, { videos: [] });
  }
}
