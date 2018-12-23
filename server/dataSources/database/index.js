const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const models = require('./models');
const seed = require('./seed');

cachegoose(mongoose);

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://localhost:27017/sivananda-housekeeping',
    {
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
    }
  )
  .then(() => seed.fromFixtures());

module.exports = models;
