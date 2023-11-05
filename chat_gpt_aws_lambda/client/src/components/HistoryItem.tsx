import React, { useEffect } from 'react';
import { ChatHistory } from '../API/model/ChatHistory';

interface HistoryItemProps {
  historyItem: ChatHistory;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ historyItem }) => {
  useEffect(() => {
    //console.log('historyItem', historyItem);
  }, []);

  const isValid = () => {
    if (historyItem.engine.startsWith('bedrock')) {
      return false;
    }

    if (!historyItem) {
      console.log('historyItem is null', historyItem);
      return false;
    }
    return true;
  };

  return isValid() ? (
    <div style={styles.container}>
      <div style={styles.date}>{historyItem.createdAt}</div>
      <div>
        <span style={styles.label}>input:</span>
        {historyItem.input}
      </div>
      <div>
        <span style={styles.label}>role:</span>
        {historyItem.role}
      </div>
      <div style={styles.content}>{historyItem.content}</div>
      <hr />
      <div style={styles.usage}>
        prompt tokens: {historyItem.usage.prompt_tokens}, completion token:{' '}
        {historyItem.usage.completion_tokens}, total:{' '}
        {historyItem.usage.total_tokens}
      </div>
    </div>
  ) : (
    <div>NO data</div>
  );
};

export default HistoryItem;

const styles = {
  container: {
    backgroundColor: '#f6f6f6',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px 0',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  },
  date: {
    fontSize: '0.8rem',
    color: '#757575',
    marginBottom: '5px',
  },
  label: {
    fontSize: '0.8rem',
    color: '#616161',
    fontWeight: 'bold',
    marginRight: '5px',
  },
  content: {
    fontSize: '1rem',
    marginBottom: '10px',
  },
  usage: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '10px',
    fontSize: '0.8rem',
    color: '#9e9e9e',
  },
  hr: {
    margin: '10px 0',
    border: 0,
    height: '1px',
    backgroundColor: '#e0e0e0',
  },
  scrollableContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
};

// Use the styles in your React component
// For example: <div style={styles.container}></div>
