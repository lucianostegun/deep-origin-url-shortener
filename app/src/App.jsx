import { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [resultLabel, setResultLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar chamada para a API
      // Por enquanto, apenas simula o processo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResultLabel(`Shortened URL will appear here for: ${url}`);
    } catch {
      setResultLabel('Error occurred while shortening URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="title">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="url-form">
          <div className="input-container">
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter your URL here..." className="url-input" disabled={isLoading} />
            <button type="submit" className="submit-button" disabled={isLoading || !url.trim()}>
              {isLoading ? 'Processing...' : 'Short it'}
            </button>
          </div>
        </form>
        <div className="result-label">{resultLabel}</div>
      </div>
    </div>
  );
}

export default App;
