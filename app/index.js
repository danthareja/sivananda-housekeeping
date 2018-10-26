const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./types');

const { LocalAPI, PrismaAPI, RetreatGuruAPI } = require('./dataSources');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  dataSources() {
    return {
      local: new LocalAPI(),
      prisma: new PrismaAPI(),
      retreatGuru: new RetreatGuruAPI(),
    };
  },
});

server.applyMiddleware({ app });

module.exports = app;
