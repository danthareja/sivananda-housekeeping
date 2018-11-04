const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const authenticate = require('./authenticate');
const resolvers = require('./resolvers');
const typeDefs = require('./types');
const db = require('./database');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const server = new ApolloServer({
  debug: true,
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  async context({ req }) {
    return {
      user: await authenticate(req),
      db,
    };
  },
});

server.applyMiddleware({ app });

// Default routing requests to the client
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

module.exports = app;
