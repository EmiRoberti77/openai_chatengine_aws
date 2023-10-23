import React, { useState } from 'react';
import { CharServer } from '../API/ChatServer';
import { ChatResponse, getChatResponse } from '../API/model/ChatResponse';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import {
  pushToHistory,
  deleteAllHistory,
} from '../state/features/HistorySlice';
import { ChatHistory } from '../API/model/ChatHistory';
import ChatOutput from './ChatOutput';
import HistoryItem from './HistoryItem';
import SavedHistory from './SavedHistory';
import { Auth } from 'aws-amplify';

const chatApi = new CharServer();

const Dialog: React.FC = () => {
  const [response, setResponse] = useState<ChatResponse | undefined>(undefined);
  const [userName, setUserName] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.history);

  const deleteHistoryHandler = () => {
    dispatch(deleteAllHistory());
  };

  const logout = async () => {
    Auth.signOut()
      .then((success) => {
        console.info(success);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  const createHistory = (
    input: string,
    chatResponse: ChatResponse
  ): ChatHistory => {
    return {
      createdAt: new Date().toISOString(),
      user: 'user',
      input,
      role: chatResponse.role,
      content: chatResponse.content,
      usage: chatResponse.usage,
    };
  };

  const handleUserInput = async () => {
    if (userInput === '') {
      setResponse(getChatResponse('missing question'));
      return;
    }
    if (userName === '') {
      setResponse(getChatResponse('missing username'));
      return;
    }
    setIsLoading(true);
    const chatResponse: ChatResponse = await chatApi.askServer({
      username: userName,
      input: userInput,
    });
    setResponse(chatResponse);
    setIsLoading(false);
    dispatch(pushToHistory(createHistory(userInput, chatResponse)));
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
      <div className="scrollable-container">
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
            <button onClick={logout}>Logout</button>
            <h4>History:</h4>
            <button onClick={() => deleteHistoryHandler()}>
              clear history
            </button>
            {[...history].reverse().map((item, index) => (
              <div key={index}>
                <HistoryItem historyItem={item} />
                <hr />
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: '20px' }}>
            <div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
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
              <button
                onClick={handleUserInput}
                style={{ padding: '10px 15px' }}
              >
                Ask
              </button>
            </div>
            <div style={{ marginTop: '10px' }}>
              {isLoading ? (
                <div>Loading . . </div>
              ) : response ? (
                <ChatOutput
                  chatResponse={{
                    role: 'assistant',
                    content: response.content,
                  }}
                />
              ) : (
                ''
              )}
              <div>
                <SavedHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
