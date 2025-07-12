import React from 'react';
import './App.css';
import UrlShortenerForm from './components/UrlShortenerForm';

function App(): React.JSX.Element {
  return (
    <div className="app-container">
      <UrlShortenerForm />
    </div>
  );
}

export default App;
