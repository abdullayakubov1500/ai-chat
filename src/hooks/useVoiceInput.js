import { useCallback, useEffect, useRef, useState } from 'react';

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useVoiceInput({ onTranscript, enabled = true }) {
  const Recognition = getSpeechRecognition();
  const supported = Boolean(Recognition);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const stop = useCallback(() => {
    const instance = recognitionRef.current;
    if (instance) {
      instance.onend = null;
      instance.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    if (!enabled) stop();
  }, [enabled, stop]);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(() => {
    if (!Recognition || !enabled) return;

    stop();
    setError('');

    const recognition = new Recognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0]?.transcript ?? '';
        if (event.results[i].isFinal) {
          finalChunk += piece;
        } else {
          interimChunk += piece;
        }
      }

      onTranscriptRef.current?.({
        finalText: finalChunk.trim(),
        interimText: interimChunk.trim(),
      });
    };

    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return;
      if (event.error === 'not-allowed') {
        setError('Нет доступа к микрофону. Разрешите его в браузере.');
      } else {
        setError('Не удалось распознать речь. Попробуйте ещё раз.');
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError('Голосовой ввод недоступен в этом браузере.');
      recognitionRef.current = null;
    }
  }, [Recognition, enabled, stop]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return { supported, isListening, error, toggle, stop };
}
