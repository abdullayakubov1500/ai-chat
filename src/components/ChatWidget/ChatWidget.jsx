import { useCallback, useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';
import { useChat } from '../../hooks/useChat.js';
import LauncherButton from './LauncherButton.jsx';
import ChatPanel from './ChatPanel.jsx';
import styles from './chatWidget.module.css';

export default function ChatWidget() {
  const { theme, toggleTheme } = useTheme();
  const {
    isOpen,
    messages,
    isTyping,
    toggleChat,
    closeChat,
    sendMessage,
    showQuickReplies,
  } = useChat();

  const [launcherClicked, setLauncherClicked] = useState(false);

  const handleLauncherClick = useCallback(() => {
    setLauncherClicked(true);
    toggleChat();
  }, [toggleChat]);

  return (
    <div className={styles.root} data-theme={theme}>
      {isOpen && (
        <ChatPanel
          theme={theme}
          onToggleTheme={toggleTheme}
          onMinimize={closeChat}
          messages={messages}
          isTyping={isTyping}
          showQuickReplies={showQuickReplies}
          onSend={sendMessage}
        />
      )}
      <LauncherButton
        isOpen={isOpen}
        onClick={handleLauncherClick}
        showPulse={!launcherClicked && !isOpen}
      />
    </div>
  );
}
