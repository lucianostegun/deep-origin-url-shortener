import React, { useState, useEffect } from 'react';
import { apiCall, apiConfig } from '../../utils/api';
import './UrlList.css';

interface Url {
  id: number;
  publicId: string;
  originalUrl: string;
  slug: string;
  clickCount: number;
  createdAt: string;
}

interface UrlListProps {
  userId?: string;
  refreshTrigger?: number;
}

const UrlList: React.FC<UrlListProps> = ({ userId, refreshTrigger }) => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchUrls = async () => {
    if (!userId) {
      setUrls([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userId) {
        headers['user-id'] = userId;
      }

      const response = await apiCall(apiConfig.endpoints.shortenUrl, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      setUrls(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Error loading URLs: ' + err.message);
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [userId]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchUrls();
    }
  }, [refreshTrigger]);

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const getShortUrl = (slug: string) => {
    return `${window.location.origin}/r/${slug}`;
  };

  const handleEdit = (url: Url) => {
    // Placeholder for edit functionality
    console.log('Edit URL:', url);
  };

  if (!userId) {
    return (
      <div className="url-list-container">
        <div className="url-list-header">
          <h2>Your URLs</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="url-list-container">
      <div className="url-list-header">
        <h2>Your shortened URLs</h2>
        {urls.length > 0 && (
          <p className="url-count">
            {urls.length} URL{urls.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your URLs...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchUrls} className="retry-button">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && urls.length === 0 && (
        <div className="empty-state">
          <p>You don't have any URL 😞</p>
          <p className="empty-subtitle">Your shortened URL will appear here</p>
        </div>
      )}

      {!loading && !error && urls.length > 0 && (
        <div className="url-list">
          <div className="url-list-table">
            {urls.map(url => (
              <div key={url.id} className="table-row">
                <div className="url-cell">
                  <a href={getShortUrl(url.slug)} target="_blank" rel="noopener noreferrer" className="short-url-link" title="Click to open">
                    {getShortUrl(url.slug)}
                  </a>
                  <div className="original-url" title={url.originalUrl}>
                    {truncateUrl(url.originalUrl)}
                  </div>
                </div>

                <div className="clicks-cell">
                  <span className="click-count">{url.clickCount}</span>
                  <span className="click-label">{url.clickCount === 1 ? 'click' : 'clicks'}</span>
                </div>

                <div className="actions-cell">
                  <button onClick={() => handleEdit(url)} className="edit-button" title="Edit URL">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlList;
