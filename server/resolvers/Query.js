const moment = require('moment');
const { Room } = require('../models');

module.exports = {
  Query: {
    async rooms(
      root,
      { date = moment().format('YYYY-MM-DD'), prioritize = true },
      ctx
    ) {
      return Room.fetch(ctx, date, prioritize);
    },
    async room(root, { id, date = moment().format('YYYY-MM-DD') }, ctx) {
      return Room.fetchById(ctx, date, id);
    },
  },
};
