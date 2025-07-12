import React, { useState } from 'react';
import './UrlShortenerForm.css';

interface UrlShortenerFormProps {
  onUrlSubmit?: (url: string) => Promise<void>;
}

interface ApiResponse {
  shortUrl: string;
}

function UrlShortenerForm({ onUrlSubmit }: UrlShortenerFormProps): React.JSX.Element {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resultLabel, setResultLabel] = useState<string>('');

  const generateShortUrl = async (url: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data: ApiResponse = await response.json();
      setResultLabel(`Shortened URL: ${data.shortUrl || 'N/A'}`);
    } catch (error) {
      console.error('Error shortening URL:', error);
      setErrorMessage('Error occurred while shortening URL');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setErrorMessage('');

    if (!url.trim()) {
      setErrorMessage('I guess you forgot to type your URL 🤔');
      return;
    }

    setIsLoading(true);
    try {
      if (onUrlSubmit) {
        await onUrlSubmit(url);
      } else {
        await generateShortUrl(url);
      }
      setUrl('');
    } catch {
      setErrorMessage('Error occurred while shortening URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
