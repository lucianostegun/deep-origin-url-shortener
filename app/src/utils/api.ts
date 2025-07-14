const API_BASE_URL = import.meta.env.API_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    shortenUrl: '/urls',
    redirect: '/urls/redirect',
  },
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = import.meta.env.DEV ? `/api${endpoint}` : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};
