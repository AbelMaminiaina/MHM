export const env = {
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || '',
  },
  api: {
    // Remove trailing slash to avoid double slashes in URLs
    baseUrl: (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, ''),
  },
} as const;
