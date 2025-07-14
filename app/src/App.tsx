import React, { useState } from 'react';
import './App.css';
import UrlShortenerForm from './components/UrlShortenerForm/UrlShortenerForm';
import UserList from './components/UserList/UserList';

function App(): React.JSX.Element {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleUserSelect = (userId: string): void => {
    setSelectedUserId(userId);
  };

  return (
    <div className="app-container">
      <UserList onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
      <UrlShortenerForm userId={selectedUserId} />
    </div>
  );
}

export default App;
