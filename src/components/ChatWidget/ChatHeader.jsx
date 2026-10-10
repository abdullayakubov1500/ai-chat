import { mockAgentProfile } from '../../mocks/agentProfile.mock.js';
import styles from './chatHeader.module.css';

export default function ChatHeader({ theme, onToggleTheme, onMinimize }) {
  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <img
          className={styles.avatar}
          src={mockAgentProfile.avatarUrl}
          alt=""
          width={40}
          height={40}
        />
        <div className={styles.meta}>
          <span className={styles.name}>{mockAgentProfile.name}</span>
          <span className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {mockAgentProfile.statusLabel}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm9-4a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-15 0a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zm12.95 6.95a1 1 0 010-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707a1 1 0 001.414 0zm-11.9-11.9a1 1 0 010-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707a1 1 0 001.414 0zM4.05 18.95a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zm11.9-11.9a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM12 8a4 4 0 100 8 4 4 0 000-8z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 14.5A8.5 8.5 0 0110.5 4 7 7 0 0021 14.5z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onMinimize}
          aria-label="Свернуть чат"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
