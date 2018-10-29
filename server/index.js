const path = require('path');
const express = require('express');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const { ApolloServer } = require('apollo-server-express');
const { InMemoryLRUCache } = require('apollo-server-caching');

const resolvers = require('./resolvers');
const typeDefs = require('./types');
const { DatabaseAPI, LocalAPI, RetreatGuruAPI } = require('./dataSources');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(
  jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://lingering-cloud-1820.auth0.com/.well-known/jwks.json',
    }),
    issuer: 'https://lingering-cloud-1820.auth0.com/',
    algorithms: ['RS256'],
  })
);

const server = new ApolloServer({
  debug: true,
  typeDefs,
  resolvers,
  cache: new InMemoryLRUCache({
    maxSize: 10 * 1000 * 1000, // divided by 2 bytes per string char ~ 5MB cache storage
  }),
  context(ctx) {
    return {
      // This key is determined by a rule set in the Auth0 dashboard
      user: ctx.req.user['https://sivananda-housekeeping.herokuapp.com/user'],
    };
  },
  dataSources() {
    return {
      database: new DatabaseAPI(),
      local: new LocalAPI(),
      retreatGuru: new RetreatGuruAPI(),
    };
  },
});

server.applyMiddleware({ app });

// Default routing requests to the client
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

module.exports = app;
