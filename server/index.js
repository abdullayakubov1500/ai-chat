import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { generateAgentReply, mapGeminiError } from './gemini.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(config.geminiApiKey),
    model: config.geminiModel,
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body ?? {};

    if (typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Поле message обязательно' });
      return;
    }

    if (!Array.isArray(history)) {
      res.status(400).json({ error: 'Поле history должно быть массивом' });
      return;
    }

    if (!config.geminiApiKey) {
      res.status(503).json({
        error: 'Сервер не настроен: добавьте GEMINI_API_KEY в .env',
      });
      return;
    }

    const reply = await generateAgentReply(message, history);
    res.json({ reply: reply.trim() });
  } catch (error) {
    console.error('[api/chat]', error);
    res.status(500).json({
      error: mapGeminiError(error),
    });
  }
});

app.listen(config.port, () => {
  console.log(`API: http://localhost:${config.port}`);
  if (!config.geminiApiKey) {
    console.warn('GEMINI_API_KEY не задан — эндпоинт /api/chat вернёт 503');
  }
});
