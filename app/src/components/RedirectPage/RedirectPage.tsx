import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall, apiConfig } from '../../utils/api';
import './RedirectPage.css';

interface RedirectPageProps {}

const RedirectPage: React.FC<RedirectPageProps> = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const redirectBySlug = async (slug: string) => {
    try {
      const response = await apiCall(`${apiConfig.endpoints.redirect}/${slug}`, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const url: any = (await response.json()).url;

        if (url) {
          return { success: true, originalUrl: url };
        }

        return { success: false, error: 'Invalid redirect' };
      } else if (response.status === 404) {
        return { success: false, error: 'URL not found' };
      } else {
        return { success: false, error: 'Internal server error' };
      }
    } catch (error) {
      return { success: false, error: 'Error connection to server' };
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      if (!slug) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      try {
        const result = await redirectBySlug(slug);

        if (result.success && result.originalUrl) {
          return (window.location.href = result.originalUrl);
        } else {
          setError(result.error || 'URL not found');
          setLoading(false);
        }
      } catch (err) {
        setError('Erro processing redirect');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [slug]);

  if (loading) {
    return (
      <div className="redirect-page">
        <div className="redirect-content">
          <div className="loading-spinner"></div>
          <h2>Redirecting...</h2>
          <p>Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="redirect-page">
        <div className="redirect-content error">
          <h1>404 - URL not found</h1>
          <p>The shortened URL you tried to access is invalid or has expired.</p>
          <button className="back-button" onClick={() => (window.location.href = '/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectPage;
