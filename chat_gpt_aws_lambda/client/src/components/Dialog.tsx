import React, { useEffect, useState } from 'react';
import { CharServer } from '../API/ChatServer';
import { ChatResponse, getChatResponse } from '../API/model/ChatResponse';
import { useSelector, useDispatch } from 'react-redux';
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
import { removeUser } from '../state/features/UserSlice';
import './css/Dialog.css';
import FileUpload from './FileUpload';

const chatApi = new CharServer();

const Dialog: React.FC = () => {
  const [response, setResponse] = useState<ChatResponse | undefined>(undefined);
  const [userName, setUserName] = useState<string>('');
  const [fullUserName, setFullUserName] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.history);
  const [fileContent, setFileContent] = useState<string | undefined>(undefined);
  const [showExtraOptions, setShowExtraOptions] = useState<boolean>(false);

  const onFileContentHandle = (content: string) => {
    console.log('onFileContentHandle');
    setFileContent(content);
    setUserInput(content);
  };

  const deleteHistoryHandler = () => {
    dispatch(deleteAllHistory());
  };

  const getUser = async () => {
    const user = await Auth.currentAuthenticatedUser();
    setUserName(user.attributes.email);
    setFullUserName(
      `${user.attributes.given_name} ${user.attributes.family_name}`
    );
    console.info('user logged in', user);
  };
  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    Auth.signOut()
      .then((success) => {
        console.info('signOut', success);
        window.location.reload();
        dispatch(removeUser());
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
            <hr />
            <button className="styled-button logout" onClick={logout}>
              Logout
            </button>

            <button
              className="styled-button clear-history"
              onClick={() => deleteHistoryHandler()}
            >
              Clear History
            </button>
            <hr />
            <div className="user-card">
              <h4>{fullUserName}</h4>
              <h5>{userName}</h5>
            </div>
            <h4>History:</h4>
            {[...history].reverse().map((item, index) => (
              <div key={index}>
                <HistoryItem historyItem={item} />
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
              {showExtraOptions && (
                <FileUpload onFileContentHandle={onFileContentHandle} />
              )}
              <button
                className="styled-button clear-history"
                onClick={handleUserInput}
                style={{ padding: '10px 15px' }}
              >
                Ask
              </button>
              <button onClick={() => setShowExtraOptions(!showExtraOptions)}>
                {showExtraOptions ? '-' : '+'}
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
