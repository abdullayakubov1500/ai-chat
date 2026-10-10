import { mockAgentProfile } from '../../mocks/agentProfile.mock.js';
import styles from './launcherButton.module.css';

export default function LauncherButton({ isOpen, onClick, showPulse = false }) {
  return (
    <div className={styles.host}>
      {showPulse && (
        <span className={styles.rippleLayer} aria-hidden="true">
          <span className={styles.ripple} />
          <span className={styles.ripple} />
        </span>
      )}
      <button
        type="button"
        className={styles.launcher}
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls="ai-chat-panel"
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат с ассистентом'}
      >
      {isOpen ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <img
          className={styles.avatar}
          src={mockAgentProfile.avatarUrl}
          alt=""
          width={56}
          height={56}
        />
      )}
      </button>
    </div>
  );
}
