import React, { useEffect, useState } from 'react';
import { ChatHistory } from '../API/model/ChatHistory';
import { CharServer } from '../API/ChatServer';
import { error } from 'console';
import HistoryItem from './HistoryItem';
import SavedHistoryItem from './SavedHistoryItem';
import { SavedChatHistory } from '../API/model/SaveChatHistory';

const chatServer = new CharServer();

const SavedHistory: React.FC = () => {
  const [savedChats, setSavedChats] = useState<SavedChatHistory[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSavedHistory = async () => {
    console.log('fetching data');
    setLoading(true);
    const response = await chatServer.getSavedChats();
    console.log('response', response);
    setSavedChats(response);
    console.log(savedChats);
    setLoading(false);
  };

  useEffect(() => {
    fetchSavedHistory().catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    console.log('updated saveChats', savedChats);
  }, [savedChats]);

  return (
    <div>
      {loading && <div>loading .. </div>}
      <div>
        {savedChats?.map((item, index) => (
          <div key={`parent${index}`}>
            <div key={`child${index}`}>
              <SavedHistoryItem savedChatItem={item} />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedHistory;
