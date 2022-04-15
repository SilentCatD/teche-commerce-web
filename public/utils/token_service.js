function formatPathAccessToken() {
  return `access-token`;
}

function formatPathRefreshToken() {
  return `refresh-token`;
}

const TokenService = {
  accessToken: {
    get: () => {
      const key = formatPathAccessToken();
      return localStorage.getItem(key);
    },
    set: (token) => {
      const key = formatPathAccessToken();
      localStorage.setItem(key, token);
    },
    del: () => {
      const key = formatPathAccessToken();
      localStorage.removeItem(key);
    },
  },

  refreshToken: {
    get: () => {
      const key = formatPathRefreshToken();
      return localStorage.getItem(key);
    },
    set: (token) => {
      const key = formatPathRefreshToken();
      localStorage.setItem(key, token);
    },
    del: () => {
      const key = formatPathRefreshToken();
      localStorage.removeItem(key);
    },
  },
};

export default TokenService;
