import { mockAgentProfile } from '../../mocks/agentProfile.mock.js';
import styles from './typingIndicator.module.css';

export default function TypingIndicator() {
  return (
    <div className={styles.row} aria-live="polite" aria-label="Ассистент печатает">
      <img
        className={styles.avatar}
        src={mockAgentProfile.avatarUrl}
        alt=""
        width={28}
        height={28}
      />
      <div className={styles.bubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}
