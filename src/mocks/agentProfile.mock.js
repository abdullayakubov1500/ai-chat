import { shopConfig } from './shopConfig.mock.js';

export const mockAgentProfile = {
  id: 'agent-1',
  name: `Консультант ${shopConfig.name}`,
  status: 'online',
  statusLabel: 'В сети',
  avatarUrl: '/avatars/agent.svg',
  welcomeMessage:
    `Здравствуйте! Помогу подобрать автотовары: масла, фильтры, аккумуляторы, шины и аксессуары. По ремонту и другим вопросам звоните в мастерскую: ${shopConfig.workshopPhone}. Что ищете для вашего авто?`,
};
