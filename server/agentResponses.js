import { shopConfig } from '../shared/shopConfig.js';
import { config } from './config.js';

const workshopPhone = () => config.workshopPhone || shopConfig.workshopPhone;

export function getGreetingReply() {
  return `Здравствуйте! Я консультант магазина «${shopConfig.name}» — помогу подобрать автотовары: масла, фильтры, аккумуляторы, шины и аксессуары. Напишите марку, модель и год автомобиля. По ремонту и сервису звоните в мастерскую: ${workshopPhone()}.`;
}

export function getOffTopicReply() {
  return `Я консультирую только по автотоварам «${shopConfig.name}». По этому вопросу, пожалуйста, позвоните в автомастерскую: ${workshopPhone()}. Если нужен подбор масла, фильтров, АКБ или шин — напишите марку и модель авто.`;
}

const GREETING_ONLY =
  /^(привет|приветствую|здравствуйте|здравствуй|добрый\s+день|добрый\s+вечер|доброе\s+утро|hi|hello|салют)[!.?\s]*$/i;

const OFF_TOPIC_USER =
  /chatflow|чат[\s-]?виджет|виджет.{0,40}(сайт|сайта|chatflow)|тариф.{0,40}(чат|сервис|виджет)|подключ.{0,40}виджет|saas|crm|jivo|интеграц.{0,20}сайт|погод|политик|крипт|биткоин|программир|напиши\s+код|медицин|рецепт/i;

const AUTO_PRODUCT_TOPIC =
  /авто|машин|автомоб|масл|антифриз|тосол|фильтр|аккумулятор|акб|шин|резин|диск|колес|свеч|ремен|ламп|щетк|дворник|коврик|чехол|ароматиз|антифриз|тормозн.{0,10}жидк|охлажда|трансмис|atf|двигател|vin|марк|модел|год\s+выпуск|доставк|самовывоз|оплат|возврат|наличи|артикул|запчаст|расходник|тониров|номер|капот|бампер|стойк|амортизатор|подшипник|сцеплен/i;

export const FORBIDDEN_AGENT_REPLY =
  /chatflow|чат[\s-]?виджет|виджет.{0,80}чат|тариф.{0,80}(чат|виджет)|подключ.{0,80}виджет|установк.{0,80}виджет|пообщаться.{0,80}виджет/i;

export function isGreetingOnly(message) {
  return GREETING_ONLY.test(message.trim());
}

export function isOffTopicUserMessage(message) {
  const text = message.trim();
  if (!text) return false;
  if (OFF_TOPIC_USER.test(text)) return true;
  if (AUTO_PRODUCT_TOPIC.test(text)) return false;
  return false;
}

export function sanitizeAgentReply(text) {
  if (!text?.trim() || FORBIDDEN_AGENT_REPLY.test(text)) {
    return getOffTopicReply();
  }
  return text.trim();
}
