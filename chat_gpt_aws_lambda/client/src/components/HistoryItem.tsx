import React from 'react';
import { ChatHistory } from '../API/model/ChatHistory';
import styles from './css/HistoryItem.module.css';

interface HistoryItemProps {
  historyItem: ChatHistory;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ historyItem }) => {
  return (
    <div className={styles.container}>
      <div className={styles.date}>{historyItem.createdAt}</div>
      <div>
        <span className={styles.label}>input:</span>
        {historyItem.input}
      </div>
      <div>
        <span className={styles.label}>role:</span>
        {historyItem.role}
      </div>
      <div className={styles.content}>{historyItem.content}</div>
      <hr />
      <div className={styles.usage}>
        prompt tokens: {historyItem.usage.prompt_tokens}, completion token:{' '}
        {historyItem.usage.completion_tokens}, total:{' '}
        {historyItem.usage.total_tokens}
      </div>
    </div>
  );
};

export default HistoryItem;
