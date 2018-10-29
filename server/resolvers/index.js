const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');

module.exports = mergeResolvers(fileLoader(__dirname));
