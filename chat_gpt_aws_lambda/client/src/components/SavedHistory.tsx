import React, { useEffect, useState } from 'react';
import { CharServer } from '../API/ChatServer';
import SavedHistoryItem from './SavedHistoryItem';
import { SavedChatHistory } from '../API/model/SaveChatHistory';
import { Auth } from 'aws-amplify';

const chatServer = new CharServer();

const SavedHistory: React.FC = () => {
  const [savedChats, setSavedChats] = useState<SavedChatHistory[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSavedHistory = async () => {
    setLoading(true);
    const sessionUser = await Auth.currentAuthenticatedUser();
    const user = sessionUser.attributes.email;

    const response = await chatServer.getSavedChats(user);
    //console.log('response', response);
    setSavedChats(response);
    //console.log(savedChats);
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
