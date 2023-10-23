import { useEffect, useState } from 'react';
import './App.css';
import Dialog from './components/Dialog';
import Login from './components/Login';
import { Auth } from 'aws-amplify';

function App() {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [jwtToken, setJWTToken] = useState<string | undefined>(undefined);

  const getSessionToken = async () => {
    const session = await Auth.currentSession();
    if (session) {
      const token = session.getIdToken();
      const jwt = token.getJwtToken();
      console.info('jwt', jwt);
      setJWTToken(jwt);
    }
  };

  useEffect(() => {
    getSessionToken().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.info('user logged in', isLogged, jwtToken);
  }, [setIsLogged, jwtToken]);

  return (
    <div className="App">
      {isLogged ? <Dialog /> : <Login setIsLogged={setIsLogged} />}
    </div>
  );
}

export default App;
