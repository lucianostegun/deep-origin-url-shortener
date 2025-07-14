import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { redirectBySlug } from '../../utils/api';
import './RedirectPage.css';

interface RedirectPageProps {}

const RedirectPage: React.FC<RedirectPageProps> = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError(result.error || 'URL encurtada não encontrada');
          setLoading(false);
        }
      } catch (err) {
        setError('Erro ao processar redirecionamento');
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
          <p>{error}</p>
          <p>The shortened URL you tried to access is either invalid or has expired.</p>
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
