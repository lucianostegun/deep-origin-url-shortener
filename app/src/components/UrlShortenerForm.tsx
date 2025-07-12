import React, { useState } from 'react';
import './UrlShortenerForm.css';
import { apiCall, apiConfig } from '../utils/api';

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
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(resultLabel);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const generateShortUrl = async (url: string): Promise<void> => {
    try {
      const response = await apiCall(apiConfig.endpoints.shortenUrl, {
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json);
      }

      const data: ApiResponse = json;
      setResultLabel(data.shortUrl);
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      setErrorMessage('Failed to shorten URL: ' + error.message);
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
      {resultLabel && (
        <div className="result-container">
          <div className="result-label">{resultLabel}</div>
          <button type="button" onClick={copyToClipboard} className="copy-button" title="Copy to clipboard">
            {copySuccess ? '✓ Copied!' : 'Copy URL'}
          </button>
        </div>
      )}
    </div>
  );
}

export default UrlShortenerForm;
