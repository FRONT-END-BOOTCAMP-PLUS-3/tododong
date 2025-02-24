'use client';
import { useRef, useState, useEffect } from 'react';
import styles from './ChatSection.module.scss';
import Icon from '@/components/icon/Icon';
import Chat from './Chat';

const ChatSection = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'; // 높이 초기화
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 72)}px`; // 최대 3줄 높이 (72px) 제한
    }
  }, [value]);

  return (
    <section className={styles.container}>
      <div className={styles.chatTitle}>채팅</div>
      <div className={styles.chatContainer}>
        <Chat />
        <Chat />
        <Chat />
      </div>
      <div className={styles.chatInputContainer}>
        <div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="채팅을 입력하세요."
          />
          <div className={styles.iconArrowUp}>
            <Icon id="arrow-up" width={11.15} height={12.6} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
