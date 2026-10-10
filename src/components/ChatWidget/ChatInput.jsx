import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './chatInput.module.css';

export default function ChatInput({ onSend, disabled, autoFocus }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  const submit = useCallback(() => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className={styles.footer}>
      <div className={styles.field}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          placeholder="Напишите сообщение…"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Сообщение"
        />
        <button
          type="button"
          className={styles.send}
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Отправить сообщение"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12l14-7-4 7 4 7-14-7z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <p className={styles.hint}>Enter — отправить, Shift+Enter — новая строка</p>
    </div>
  );
}
