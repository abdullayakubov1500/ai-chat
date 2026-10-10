import { matchAgentReply } from '../mocks/agentReplies.mock.js';

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === undefined ||
  import.meta.env.VITE_USE_MOCK === 'true';

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

export async function getAgentReply(userText) {
  if (!USE_MOCK) {
    throw new Error('Реальный API ещё не подключён. Установите VITE_USE_MOCK=true.');
  }

  await delay(randomDelay());
  return matchAgentReply(userText);
}
