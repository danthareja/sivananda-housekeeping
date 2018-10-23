const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./types');

const { prisma, RetreatGuruAPI } = require('./dataSources');

const app = express();

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  dataSources() {
    return {
      prisma,
      retreatGuruAPI: new RetreatGuruAPI()
    }
  },
})

server.applyMiddleware({ app });

module.exports = app;