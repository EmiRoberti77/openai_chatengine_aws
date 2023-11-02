import React from 'react';

interface ChatOutputProps {
  chatResponse: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const ChatOutput: React.FC<ChatOutputProps> = ({ chatResponse }) => {
  const { role, content } = chatResponse;

  return (
    <div style={{ ...styles.container, ...styles[role] }}>
      <div style={styles.role}>role: {role}</div>
      <div style={styles.content}>{content}</div>
    </div>
  );
};

export default ChatOutput;
const styles = {
  container: {
    maxWidth: '80%',
    padding: '10px',
    margin: '10px auto',
    borderRadius: '5px',
  } as React.CSSProperties,
  user: {
    backgroundColor: '#e1f5fe',
    textAlign: 'left',
  } as React.CSSProperties,
  assistant: {
    backgroundColor: '#f3e5f5',
    textAlign: 'right',
  } as React.CSSProperties,
  role: {
    fontSize: '0.8rem',
    color: '#757575',
    marginBottom: '5px',
  } as React.CSSProperties,
  content: {
    fontSize: '1rem',
    textAlign: 'left',
    whiteSpace: 'pre-line',
  } as React.CSSProperties,
};
