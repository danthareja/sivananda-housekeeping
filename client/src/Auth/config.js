export default {
  domain:
    process.env.REACT_APP_AUTH0_DOMAIN || 'lingering-cloud-1820.auth0.com',
  clientID:
    process.env.REACT_APP_AUTH0_CLIENT_ID || '-ZtggL5v3r3mbSnu2OmQDdhlFcpyWEmE',
  redirectUri:
    process.env.REACT_APP_AUTH0_CALLBACK_URL ||
    'http://localhost:3000/callback',
};
