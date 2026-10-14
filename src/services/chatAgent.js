import { matchAgentReply } from '../mocks/agentReplies.mock.js';
import { shopConfig } from '../mocks/shopConfig.mock.js';

const FORBIDDEN_REPLY =
  /chatflow|чат[\s-]?виджет|виджет.{0,80}чат|установк.{0,80}виджет|тариф.{0,80}виджет/i;

function autoShopFallback() {
  return `Я консультирую только по автотоварам «${shopConfig.name}». По этому вопросу, пожалуйста, позвоните в автомастерскую: ${shopConfig.workshopPhone}. Если нужен подбор масла, фильтров, АКБ или шин — напишите марку и модель авто.`;
}

function sanitizeReply(text) {
  if (!text?.trim() || FORBIDDEN_REPLY.test(text)) {
    return autoShopFallback();
  }
  return text.trim();
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const MIN_DELAY_MS = 600;
const MAX_DELAY_MS = 1500;

function randomDelay() {
  return MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1));
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function toApiHistory(messages) {
  return messages
    .filter((item) => item.role === 'user' || item.role === 'agent')
    .filter((item) => item.role !== 'agent' || !FORBIDDEN_REPLY.test(item.text || ''))
    .map((item) => ({ role: item.role, text: item.text }));
}

async function fetchGeminiReply(userText, history) {
  const url = `${API_BASE}/api/chat`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userText,
      history: toApiHistory(history),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = typeof data.error === 'string' ? data.error : 'Ошибка API';
    throw new Error(detail);
  }

  if (!data.reply?.trim()) {
    throw new Error('Пустой ответ от сервера');
  }

  return sanitizeReply(data.reply);
}

export async function getAgentReply(userText, history = []) {
  if (USE_MOCK) {
    await delay(randomDelay());
    return matchAgentReply(userText);
  }

  return fetchGeminiReply(userText, history);
}
