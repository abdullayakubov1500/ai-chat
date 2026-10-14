import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config.js';
import { getAgentSystemPrompt } from './prompts/systemPrompt.js';
import {
  FORBIDDEN_AGENT_REPLY,
  getGreetingReply,
  getOffTopicReply,
  isGreetingOnly,
  isOffTopicUserMessage,
  sanitizeAgentReply,
} from './agentResponses.js';

function shouldDropHistoryMessage(item) {
  if (item.role !== 'agent' && item.role !== 'model') return false;
  return FORBIDDEN_AGENT_REPLY.test(item.text || '');
}

function toGeminiRole(role) {
  return role === 'agent' || role === 'model' ? 'model' : 'user';
}

function buildContents(history, message) {
  const items = [];

  for (const item of history) {
    if (!item?.text?.trim()) continue;
    if (item.role !== 'user' && item.role !== 'agent') continue;
    if (shouldDropHistoryMessage(item)) continue;
    items.push({
      role: toGeminiRole(item.role),
      parts: [{ text: item.text.trim() }],
    });
  }

  const trimmedMessage = message.trim();
  const last = items[items.length - 1];
  if (!last || last.role !== 'user' || last.parts[0].text !== trimmedMessage) {
    items.push({ role: 'user', parts: [{ text: trimmedMessage }] });
  }

  const lastUser = items[items.length - 1];
  if (lastUser?.role === 'user') {
    lastUser.parts[0].text =
      `Отвечай только как консультант магазина автотоваров «АвтоМастер». Не упоминай ChatFlow, чат-виджеты и тарифы на чат.\n\nВопрос клиента: ${lastUser.parts[0].text}`;
  }

  while (items.length > 0 && items[0].role === 'model') {
    items.shift();
  }

  const merged = [];
  for (const item of items) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === item.role) {
      prev.parts[0].text += `\n\n${item.parts[0].text}`;
      continue;
    }
    merged.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
  }

  return merged;
}

function extractText(response) {
  const text = response.text?.();
  if (text?.trim()) return text.trim();

  const reason = response.candidates?.[0]?.finishReason;
  throw new Error(
    reason === 'SAFETY'
      ? 'Ответ не сгенерирован: сработали фильтры безопасности Gemini'
      : 'Пустой ответ от Gemini',
  );
}

export function mapGeminiError(error) {
  const message = error?.message || String(error);

  if (/API key not valid|API_KEY_INVALID/i.test(message)) {
    return 'Неверный GEMINI_API_KEY. Проверьте ключ в файле .env';
  }
  if (/429|quota|RESOURCE_EXHAUSTED/i.test(message)) {
    return 'Превышен лимит запросов Gemini. Попробуйте позже.';
  }
  if (/404/i.test(message) && /model/i.test(message)) {
    return `Модель «${config.geminiModel}» недоступна. Укажите другую в GEMINI_MODEL (например gemini-1.5-flash).`;
  }

  return message.length < 200
    ? message
    : 'Не удалось получить ответ от агента. Перезапустите npm run dev после изменения .env';
}

export async function generateAgentReply(message, history = []) {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY не задан');
  }

  const trimmed = message.trim();

  if (isGreetingOnly(trimmed)) {
    return getGreetingReply();
  }

  if (isOffTopicUserMessage(trimmed)) {
    return getOffTopicReply();
  }

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({
    model: config.geminiModel,
    systemInstruction: getAgentSystemPrompt(),
  });

  const contents = buildContents(history, message);

  let replyText;

  if (contents.length === 0) {
    const result = await model.generateContent(message.trim());
    replyText = extractText(result.response);
  } else if (contents.length === 1) {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: contents[0].parts }],
    });
    replyText = extractText(result.response);
  } else {
    const chatHistory = contents.slice(0, -1);
    const lastUserMessage = contents[contents.length - 1].parts[0].text;
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(lastUserMessage);
    replyText = extractText(result.response);
  }

  return sanitizeAgentReply(replyText);
}
