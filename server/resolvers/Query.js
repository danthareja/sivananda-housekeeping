const moment = require('moment');
const { Room } = require('../models');

module.exports = {
  Query: {
    async rooms(root, { date = moment().format('YYYY-MM-DD') }, ctx) {
      return Room.fetch(ctx, date);
    },
    async room(root, { id, date = moment().format('YYYY-MM-DD') }, ctx) {
      return Room.fetchById(ctx, date, id);
    },
  },
};
