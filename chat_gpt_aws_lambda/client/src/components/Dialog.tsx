import React, { useState } from 'react';
import { CharServer } from '../API/ChatServer';
import { ChatResponse } from '../API/model/ChatResponse';

const chatApi = new CharServer();

const Dialog = () => {
  const [response, setResponse] = useState<ChatResponse | undefined>(undefined);
  const [userInput, setUserInput] = useState<string>('');

  const handleUserInput = async () => {
    if (userInput === '') {
      setResponse({
        content: 'missing question',
        role: 'assistant',
      });

      return;
    }
    const chatResponse: ChatResponse = await chatApi.askServer(userInput);
    setResponse(chatResponse);
  };

  return (
    <div>
      <div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleUserInput}>Ask</button>
      </div>
      {JSON.stringify(response)};
      <hr />
    </div>
  );
};

export default Dialog;
