const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const providers = {
  Google: {
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  },

  GitHub: {
    clientId: process.env.GITHUB_AUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
  },
};

const endpoints = {
  callback: siteUrl + '/user/',
  signin: siteUrl + '/api/auth/signin/',
};

export { siteUrl, providers, endpoints };
