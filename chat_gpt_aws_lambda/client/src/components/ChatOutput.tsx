import React from 'react';
import styles from './css/ChatOutput.module.css';

interface ChatOutputProps {
  chatResponse: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const ChatOutput: React.FC<ChatOutputProps> = ({ chatResponse }) => {
  const { role, content } = chatResponse;

  return (
    <div className={`${styles.container} ${styles[role]}`}>
      <div className={styles.role}>role: {role}</div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default ChatOutput;
