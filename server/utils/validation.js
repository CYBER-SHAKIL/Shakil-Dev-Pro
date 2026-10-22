export function readJsonBody(req, maxBytes = 16_000) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
        reject(Object.assign(new Error('Request body too large'), { statusCode: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(Object.assign(new Error('Invalid JSON body'), { statusCode: 400 })); }
    });
    req.on('error', reject);
  });
}

export function setJsonHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
}

export function sendJson(res, status, data) {
  setJsonHeaders(res);
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export function onlyMethod(req, res, method) {
  res.setHeader('Allow', method);
  if (req.method !== method) {
    sendJson(res, 405, { error: 'Method not allowed' });
    return false;
  }
  return true;
}

export function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\u0000/g, '').slice(0, maxLength);
}
