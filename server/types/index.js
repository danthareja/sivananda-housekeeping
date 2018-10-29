const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

module.exports = mergeTypes(fileLoader(__dirname), { all: true });
