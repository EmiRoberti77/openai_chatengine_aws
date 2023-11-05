import React, { useEffect } from 'react';
import { SavedChatHistory } from '../API/model/SaveChatHistory';

interface SavedHistoryItemProp {
  savedChatItem: SavedChatHistory;
}
const ChatGptSavedHistoryItem: React.FC<SavedHistoryItemProp> = ({
  savedChatItem,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.date}>{savedChatItem.createdAt}</div>
      <div style={{ backgroundColor: '#f3e5f5' }}>
        <span style={styles.label}>input:</span>
        {savedChatItem.userInput.input}
      </div>
      <div>
        <span style={styles.label}>role:</span>
        {savedChatItem.chatCompletion.choices[0].message.role}
      </div>
      <div style={styles.content}>
        {savedChatItem.chatCompletion.choices[0].message.content}
      </div>
      <hr />
      <div style={styles.usage}>
        prompt tokens: {savedChatItem.chatCompletion.usage.prompt_tokens},
        completion token: {savedChatItem.chatCompletion.usage.completion_tokens}
        , total: {savedChatItem.chatCompletion.usage.total_tokens}
      </div>
    </div>
  );
};

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
    whiteSpace: 'pre-line',
  } as React.CSSProperties,
  content: {
    fontSize: '1rem',
    marginBottom: '10px',
    whiteSpace: 'pre-line',
  } as React.CSSProperties,
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

export default ChatGptSavedHistoryItem;
