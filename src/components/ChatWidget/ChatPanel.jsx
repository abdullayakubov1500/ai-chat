import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import ChatInput from './ChatInput.jsx';
import styles from './chatWidget.module.css';

export default function ChatPanel({
  theme,
  onToggleTheme,
  onMinimize,
  messages,
  isTyping,
  showQuickReplies,
  onSend,
}) {
  return (
    <div id="ai-chat-panel" className={styles.panelWrapper} role="dialog" aria-label="Чат с ассистентом">
      <ChatHeader theme={theme} onToggleTheme={onToggleTheme} onMinimize={onMinimize} />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        showQuickReplies={showQuickReplies}
        onQuickReply={onSend}
      />
      <ChatInput onSend={onSend} disabled={isTyping} autoFocus />
    </div>
  );
}
