const API_BASE_URL = import.meta.env.API_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    shortenUrl: '/urls',
  },
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = import.meta.env.DEV
    ? `/api${endpoint}` // Em desenvolvimento, usa proxy
    : `${API_BASE_URL}${endpoint}`; // Em produção, usa URL completa

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};
