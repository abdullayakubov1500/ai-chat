import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput.js';
import styles from './chatInput.module.css';

function resizeTextarea(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
}

export default function ChatInput({ onSend, disabled, autoFocus }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);
  const committedRef = useRef('');

  const applyTranscript = useCallback(({ finalText, interimText }) => {
    const base = committedRef.current;
    if (finalText) {
      committedRef.current = [base, finalText].filter(Boolean).join(' ').trim();
    }
    const next = [committedRef.current, interimText].filter(Boolean).join(' ').trim();
    setValue(next);
  }, []);

  const { supported, isListening, error, toggle, stop } = useVoiceInput({
    onTranscript: applyTranscript,
    enabled: !disabled,
  });

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [value]);

  const submit = useCallback(() => {
    if (!value.trim() || disabled) return;
    stop();
    onSend(value);
    committedRef.current = '';
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend, stop]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e) => {
    const next = e.target.value;
    setValue(next);
    committedRef.current = next;
  };

  const placeholder = isListening
    ? 'Слушаю… говорите'
    : 'Напишите сообщение или нажмите микрофон';

  return (
    <div className={styles.footer}>
      <div className={`${styles.field} ${isListening ? styles.fieldListening : ''}`}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          rows={1}
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Сообщение"
        />
        {supported && (
          <button
            type="button"
            className={`${styles.mic} ${isListening ? styles.micActive : ''}`}
            onClick={toggle}
            disabled={disabled}
            aria-pressed={isListening}
            aria-label={isListening ? 'Остановить голосовой ввод' : 'Начать голосовой ввод'}
            title={isListening ? 'Стоп' : 'Голосовой ввод'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z"
                fill="currentColor"
              />
              <path
                d="M7 11a5 5 0 0010 0M12 16v3M9 19h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
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
      <p className={styles.hint} aria-live="polite">
        {error
          || (isListening
            ? 'Говорите — текст появится в поле. Нажмите микрофон ещё раз, чтобы остановить.'
            : 'Enter — отправить · микрофон — голос')}
      </p>
    </div>
  );
}
