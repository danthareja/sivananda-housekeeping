const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  authenticate(req) {
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

      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          return reject(
            new AuthenticationError(
              'Invalid credentials. The provided authorization token could not be verified'
            )
          );
        }
        // This key is determined by a rule set in the Auth0 dashboard
        console.log('user console log', user);
        resolve(user);
      });
    });
  },
  async login(username, password) {
    const passwordStored =
      process.env[
        `USER_${username.toUpperCase().replaceAll(' ', '_')}_VIEWER`
      ] ||
      process.env[
        `USER_${username.toUpperCase().replaceAll(' ', '_')}_EDITOR`
      ] ||
      process.env[`USER_${username.toUpperCase().replaceAll(' ', '_')}_ADMIN`];

    if (!passwordStored) throw new Error('user not found');
    if (password !== passwordStored) throw new Error('password wrong');

    const role = Object.keys(process.env)
      .find(key =>
        key.match(
          new RegExp(`^USER_${username.toUpperCase().replaceAll(' ', '_')}_`)
        )
      )
      ?.match(/(VIEWER|EDITOR|ADMIN)$/)?.[0];

    const user = { username, role };
    const token = jwt.sign(user, process.env.TOKEN_SECRET, {
      expiresIn: process.env.SESSION_DURATION,
    });
    return token;
  },
};
