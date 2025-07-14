import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import UrlShortenerForm from './components/UrlShortenerForm/UrlShortenerForm';
import UserList from './components/UserList/UserList';
import UrlList from './components/UrlList/UrlList';
import RedirectPage from './components/RedirectPage/RedirectPage';

function App(): React.JSX.Element {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [refreshUrls, setRefreshUrls] = useState(0);

  const handleUserSelect = (userId: string): void => {
    setSelectedUserId(userId);
  };

  const handleUrlCreated = (): void => {
    setRefreshUrls(prev => prev + 1);
  };

  const HomePage = () => (
    <div className="app-container">
      <UserList onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
      <UrlShortenerForm userId={selectedUserId} onUrlCreated={handleUrlCreated} />
      <UrlList userId={selectedUserId} refreshTrigger={refreshUrls} />
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
