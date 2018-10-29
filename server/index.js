const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { InMemoryLRUCache } = require('apollo-server-caching');
const resolvers = require('./resolvers');
const typeDefs = require('./types');

const { DatabaseAPI, LocalAPI, RetreatGuruAPI } = require('./dataSources');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  cache: new InMemoryLRUCache({
    maxSize: 10 * 1000 * 1000, // divided by 2 bytes per string char ~ 5MB cache storage
  }),
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
