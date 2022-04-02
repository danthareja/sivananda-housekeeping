const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { InMemoryLRUCache } = require('apollo-server-caching');
const { authenticate, login } = require('./authenticate');
const resolvers = require('./resolvers');
const typeDefs = require('./types');
const { database, RetreatGuruAPI } = require('./dataSources');
const cors = require('cors');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(cors('*'));

const server = new ApolloServer({
  debug: true,
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  cache: new InMemoryLRUCache({
    maxSize: 100 * 1000 * 1000, // divided by 2 bytes per string char ~ 50MB cache storage
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

app.post('/login', express.json(), async (req, res) => {
  console.log('logging in', req.body.username);
  try {
    const token = await login(req.body.username, req.body.password);
    res.send(token);
  } catch (e) {
    console.error('error in login', e, req.body.username);
    res.send('error in login');
  }
});

// Default routing requests to the client
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

module.exports = app;
