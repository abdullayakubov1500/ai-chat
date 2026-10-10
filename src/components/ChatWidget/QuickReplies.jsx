import { mockQuickReplies } from '../../mocks/quickReplies.mock.js';
import styles from './quickReplies.module.css';

export default function QuickReplies({ onSelect, visible }) {
  if (!visible) return null;

  return (
    <div className={styles.wrap} role="group" aria-label="Быстрые ответы">
      {mockQuickReplies.map((item) => (
        <button
          key={item.id}
          type="button"
          className={styles.chip}
          onClick={() => onSelect(item.text)}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}
