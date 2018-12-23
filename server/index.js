const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { InMemoryLRUCache } = require('apollo-server-caching');
const authenticate = require('./authenticate');
const resolvers = require('./resolvers');
const typeDefs = require('./types');
const { database, RetreatGuruAPI } = require('./dataSources');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const server = new ApolloServer({
  debug: true,
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  cache: new InMemoryLRUCache({
    maxSize: 20 * 1000 * 1000, // divided by 2 bytes per string char ~ 10MB cache storage
  }),
  async context({ req }) {
    return {
      user: await authenticate(req),
    };
  },
  dataSources() {
    return {
      database,
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
