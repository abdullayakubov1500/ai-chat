import { useCallback, useRef, useState } from 'react';
import { mockAgentProfile } from '../mocks/agentProfile.mock.js';
import { shopConfig } from '../mocks/shopConfig.mock.js';
import { getAgentReply } from '../services/chatAgent.js';

function createMessage(role, text) {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    createdAt: new Date().toISOString(),
  };
}

export function useChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasGreetedRef = useRef(false);
  const sendLockRef = useRef(false);

  const appendGreetingIfNeeded = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [createMessage('agent', mockAgentProfile.welcomeMessage)];
    });
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    appendGreetingIfNeeded();
  }, [appendGreetingIfNeeded]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isOpen, openChat, closeChat]);

  const sendMessage = useCallback(async (rawText) => {
    const text = rawText.trim();
    if (!text || sendLockRef.current) return;

    setIsOpen(true);
    sendLockRef.current = true;

    let conversationForApi = [];
    setMessages((prev) => {
      const next = [...prev];
      if (!hasGreetedRef.current && next.length === 0) {
        hasGreetedRef.current = true;
        next.push(createMessage('agent', mockAgentProfile.welcomeMessage));
      }
      next.push(createMessage('user', text));
      conversationForApi = next;
      return next;
    });
    setIsTyping(true);

    try {
      const reply = await getAgentReply(text, conversationForApi);
      setMessages((prev) => [...prev, createMessage('agent', reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage(
          'agent',
          `Сейчас не удалось получить ответ. По автотоварам напишите марку и модель ещё раз. По ремонту звоните в мастерскую: ${shopConfig.workshopPhone}.`,
        ),
      ]);
    } finally {
      setIsTyping(false);
      sendLockRef.current = false;
    }
  }, []);

  return {
    isOpen,
    messages,
    isTyping,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    showQuickReplies: messages.length <= 1 && !isTyping,
  };
}
