import { getPublicProjects } from '../server/services/project-service.js';
import { getDatabase } from '../server/utils/firebase-admin.js';
import { onlyMethod, sendJson } from '../server/utils/validation.js';

export default async function handler(req, res) {
  if (!onlyMethod(req, res, 'GET')) return;
  try {
    const snapshot = await getDatabase().ref('portfolioContent/projects').once('value');
    const saved = snapshot.val();
    if (saved && typeof saved === 'object') {
      const projects = Object.entries(saved).map(([id, item]) => ({
        id, name: item.title || 'Project', description: item.description || '',
        url: item.url || '#', badge: item.badge || 'NEW', icon: item.icon || 'WEB',
        ...(item.image ? { image: item.image } : {}),
        color1: item.color1 || '#4D6BFE', color2: item.color2 || '#1E3A8A'
      }));
      return sendJson(res, 200, { projects });
    }
  } catch (error) {
    // If Firebase is not configured yet, keep the original portfolio catalogue available.
    console.error('Dynamic projects unavailable:', error.message);
  }
  return sendJson(res, 200, { projects: getPublicProjects() });
}
