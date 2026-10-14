import { config } from './config.js';
import { generateAgentReply, mapGeminiError } from './gemini.js';

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function handleHealth(_req, res) {
  sendJson(res, 200, {
    ok: true,
    geminiConfigured: Boolean(config.geminiApiKey),
    model: config.geminiModel,
  });
}

export async function handleChat(req, res) {
  try {
    const { message, history } = req.body ?? {};

    if (typeof message !== 'string' || !message.trim()) {
      sendJson(res, 400, { error: 'Поле message обязательно' });
      return;
    }

    if (!Array.isArray(history)) {
      sendJson(res, 400, { error: 'Поле history должно быть массивом' });
      return;
    }

    if (!config.geminiApiKey) {
      sendJson(res, 503, {
        error: 'Сервер не настроен: добавьте GEMINI_API_KEY в переменные окружения',
      });
      return;
    }

    const reply = await generateAgentReply(message, history);
    sendJson(res, 200, { reply: reply.trim() });
  } catch (error) {
    console.error('[api/chat]', error);
    sendJson(res, 500, { error: mapGeminiError(error) });
  }
}

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('Некорректный JSON'));
      }
    });
    req.on('error', reject);
  });
}
