import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import QuickReplies from './QuickReplies.jsx';
import ChatBackground3D from './ChatBackground3D.jsx';
import styles from './messageList.module.css';

export default function MessageList({
  messages,
  isTyping,
  showQuickReplies,
  onQuickReply,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className={styles.list} role="log" aria-live="polite" aria-relevant="additions">
      <ChatBackground3D />
      <div className={styles.inner}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <QuickReplies visible={showQuickReplies} onSelect={onQuickReply} />
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
