import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import UrlShortenerForm from './components/UrlShortenerForm/UrlShortenerForm';
import UserList from './components/UserList/UserList';
import RedirectPage from './components/RedirectPage/RedirectPage';

function App(): React.JSX.Element {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleUserSelect = (userId: string): void => {
    setSelectedUserId(userId);
  };

  const HomePage = () => (
    <div className="app-container">
      <UserList onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
      <UrlShortenerForm userId={selectedUserId} />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/r/:slug" element={<RedirectPage />} />
    </Routes>
  );
}

export default App;
