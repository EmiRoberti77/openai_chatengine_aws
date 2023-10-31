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
import { GEN_AI_ENGINE } from '../Share/Util';

const chatApi = new CharServer();

const Dialog: React.FC = () => {
  const [response, setResponse] = useState<ChatResponse | undefined>(undefined);
  const [userName, setUserName] = useState<string>('');
  const [fullUserName, setFullUserName] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useSelector((state: RootState) => state.history);
  const [fileContent, setFileContent] = useState<string | undefined>(undefined);
  const [showExtraOptions, setShowExtraOptions] = useState<boolean>(false);
  const [onSelectedEngine, setOnSelectedEngine] = useState<string>(
    GEN_AI_ENGINE.CHATGPT_GPT3_5_TURBO
  );

  const dispatch = useDispatch();

  const onFileContentHandle = (content: string) => {
    console.info('onFileContentHandle', content);
    setFileContent(content);
    setUserInput(content);
  };

  const onSelectedEngineHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.info(e.target.value);
    setOnSelectedEngine(e.target.value);
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
      engine: onSelectedEngine,
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
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <button
                className="styled-button clear-history"
                onClick={() => setShowExtraOptions(!showExtraOptions)}
                style={{ marginTop: '10px', marginBottom: '10px' }}
              >
                {showExtraOptions ? 'Show less' : 'Show More'}
              </button>
              {showExtraOptions && (
                <div>
                  <FileUpload
                    onFileContentHandle={onFileContentHandle}
                    styleName="styled-button clear-history"
                  />
                  <select
                    onChange={onSelectedEngineHandle}
                    className="styled-button clear-history"
                    style={{ marginTop: '10px' }}
                  >
                    <option value={GEN_AI_ENGINE.CHATGPT_GPT3_5_TURBO}>
                      {GEN_AI_ENGINE.CHATGPT_GPT3_5_TURBO.toString()}
                    </option>
                    <option value={GEN_AI_ENGINE.CHATGPT_GPT4}>
                      {GEN_AI_ENGINE.CHATGPT_GPT4.toString()}
                    </option>
                  </select>
                </div>
              )}
              <button
                className="styled-button clear-history"
                onClick={handleUserInput}
                style={{
                  padding: '10px 15px',
                  marginTop: '10px',
                  width: '120px',
                }}
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
