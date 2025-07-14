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

export const redirectBySlug = async (slug: string) => {
  try {
    const url = import.meta.env.DEV ? `/api${apiConfig.endpoints.redirect}/${slug}` : `${API_BASE_URL}${apiConfig.endpoints.redirect}/${slug}`;

    const response = await fetch(url, {
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

      return { success: false, error: 'Redirecionamento inválido' };
    } else if (response.status === 404) {
      return { success: false, error: 'URL not found' };
    } else {
      return { success: false, error: 'Internal server error' };
    }
  } catch (error) {
    return { success: false, error: 'Error connection to server' };
  }
};
