import React, { useState } from 'react';
import { CharServer } from '../API/ChatServer';
import { ChatResponse, getChatResponse } from '../API/model/ChatResponse';

const chatApi = new CharServer();

const Dialog = () => {
  const [response, setResponse] = useState<ChatResponse | undefined>(undefined);
  const [userInput, setUserInput] = useState<string>('');
  const [history, setHistory] = useState([]);

  const handleUserInput = async () => {
    if (userInput === '') {
      setResponse(getChatResponse('missing question'));
      return;
    }
    const chatResponse: ChatResponse = await chatApi.askServer(userInput);
    setResponse(chatResponse);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        Emi open AI engine
      </nav>

      <div style={{ display: 'flex', marginTop: '10px' }}>
        <div
          style={{
            backgroundColor: '#f5f5f5',
            width: '30%',
            minHeight: '100vh',
            overflowY: 'auto',
            borderRight: '1px solid #e0e0e0',
            padding: '20px',
          }}
        >
          <h4>History:</h4>
          {history.map((item, index) => (
            <div key={index}>
              {JSON.stringify(item)}
              <hr />
            </div>
          ))}
        </div>

        <div style={{ flex: 1, padding: '20px' }}>
          <div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleUserInput} style={{ padding: '10px 15px' }}>
              Ask
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {JSON.stringify(response)}
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
