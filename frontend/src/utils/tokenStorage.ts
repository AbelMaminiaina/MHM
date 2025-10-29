import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
  setToken: (token: string) => {
    // Utiliser httpOnly et secure en production
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // 7 jours
      secure: import.meta.env.PROD, // HTTPS seulement en production
      sameSite: 'strict', // Protection CSRF
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  setRefreshToken: (token: string) => {
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      expires: 30, // 30 jours
      secure: import.meta.env.PROD,
      sameSite: 'strict',
    });
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  clearAll: () => {
    tokenStorage.removeToken();
    tokenStorage.removeRefreshToken();
  },
};
