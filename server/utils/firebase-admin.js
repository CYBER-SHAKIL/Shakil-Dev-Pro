import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase as firebaseGetDatabase } from 'firebase-admin/database';

function getAdminApp() {
  const existing = getApps().find(app => app.name === 'portfolio-admin');
  if (existing) return existing;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!projectId || !databaseURL) throw new Error('Firebase Admin is not configured');
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    let serviceAccount;
    try { serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON); }
    catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must be valid JSON'); }
    credential = cert(serviceAccount);
  } else {
    credential = applicationDefault();
  }
  return initializeApp({ credential, projectId, databaseURL }, 'portfolio-admin');
}

export function getDatabase() {
  return firebaseGetDatabase(getAdminApp());
}
