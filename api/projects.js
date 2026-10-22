import { getPublicProjects } from '../server/services/project-service.js';
import { onlyMethod, sendJson } from '../server/utils/validation.js';

export default function handler(req, res) {
  if (!onlyMethod(req, res, 'GET')) return;
  return sendJson(res, 200, { projects: getPublicProjects() });
}
