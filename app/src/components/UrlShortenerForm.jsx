import { useState } from 'react';
import './UrlShortenerForm.css';

function UrlShortenerForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultLabel, setResultLabel] = useState('');

  const generateShortUrl = async (url) => {
    // TODO: Implementar chamada para a API
    // Por enquanto, apenas simula o processo
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResultLabel(`Shortened URL will appear here for: ${url}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (!url.trim()) {
      setErrorMessage('I guess you forgot to type your URL 🤔');
      return;
    }

    setIsLoading(true);
    try {
      await generateShortUrl(url);
      setUrl('');
    } catch {
      setErrorMessage('Error occurred while shortening URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <div className="form-container">
      <div className="header">
        <img src="https://client-docs.deeporigin.io/images/logo.svg" alt="DeepOrigin Logo" className="logo" />
        <h1 className="title">URL Shortener 🪄</h1>
      </div>
      <p className="description">Enter your long URL below and we make it shorter for you</p>
      <form onSubmit={handleSubmit} className="url-form">
        <div className="input-group">
          <label htmlFor="url-input" className="url-label">
            URL
          </label>
          <div className="input-container">
            <input id="url-input" type="url" value={url} onChange={handleInputChange} placeholder="https://www.mywebsite.com/a-very-long-address" className="url-input" disabled={isLoading} />
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Short it'}
            </button>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </form>
      {resultLabel && <div className="result-label">{resultLabel}</div>}
    </div>
  );
}

export default UrlShortenerForm;
