const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { AuthenticationError } = require('apollo-server-express');

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://lingering-cloud-1820.auth0.com/.well-known/jwks.json',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const options = {
  issuer: 'https://lingering-cloud-1820.auth0.com/',
  algorithms: ['RS256'],
};

module.exports = function authorize(req) {
  return new Promise((resolve, reject) => {
    let token;

    if (!req.headers || !req.headers.authorization) {
      return reject(
        new AuthenticationError(
          'Credentials required. No authorization token was found'
        )
      );
    }

    const parts = req.headers.authorization.split(' ');

    if (parts.length == 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      } else {
        return reject(
          new AuthenticationError(
            'Bad credentials scheme. Format is Authorization: Bearer [token]'
          )
        );
      }
    } else {
      return reject(
        new AuthenticationError(
          'Bad credentials scheme. Format is Authorization: Bearer [token]'
        )
      );
    }

    if (!token) {
      return reject(
        new AuthenticationError(
          'Credentials required. No authorization token was found'
        )
      );
    }

    jwt.verify(token, getKey, options, (err, user) => {
      if (err) {
        return reject(
          new AuthenticationError(
            'Invalid credentials. The provided authorization token could not be verified'
          )
        );
      }
      // This key is determined by a rule set in the Auth0 dashboard
      resolve(user['https://sivananda-housekeeping.herokuapp.com/user']);
    });
  });
};
