import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { handleChat, handleHealth } from './chatHandler.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', handleHealth);
app.post('/api/chat', handleChat);

app.listen(config.port, () => {
  console.log(`API: http://localhost:${config.port}`);
  if (!config.geminiApiKey) {
    console.warn('GEMINI_API_KEY не задан — эндпоинт /api/chat вернёт 503');
  }
});
