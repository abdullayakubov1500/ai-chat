import { handleChat, readJsonBody, sendJson } from '../server/chatHandler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.end();
    return;
  }

  try {
    req.body = req.body ?? (await readJsonBody(req));
    await handleChat(req, res);
  } catch {
    sendJson(res, 400, { error: 'Некорректный JSON' });
  }
}
