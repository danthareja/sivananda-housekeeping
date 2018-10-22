const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./types');
const {
  PrismaConnector,
  RetreatGuruConnector
} = require('./connectors');

const app = express();

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  context: {
    prisma: PrismaConnector,
    retreatGuru: new RetreatGuruConnector()
  },
})

server.applyMiddleware({ app });

module.exports = app;