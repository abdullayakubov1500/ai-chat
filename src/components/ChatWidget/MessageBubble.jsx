import { mockAgentProfile } from '../../mocks/agentProfile.mock.js';
import styles from './messageBubble.module.css';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`${styles.row} ${isUser ? styles.rowUser : styles.rowAgent}`}
      data-role={message.role}
    >
      {!isUser && (
        <img
          className={styles.avatar}
          src={mockAgentProfile.avatarUrl}
          alt=""
          width={28}
          height={28}
        />
      )}
      <div className={styles.content}>
        <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAgent}`}>
          {message.text}
        </div>
        <time className={styles.time} dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
