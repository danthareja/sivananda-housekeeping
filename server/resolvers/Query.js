const { Room } = require('../models');

module.exports = {
  Query: {
    rooms(root, { date }, ctx) {
      return Room.fetch(ctx, date);
    },
    room(root, { id, date }, ctx) {
      return Room.fetchById(ctx, id, date);
    },
  },
};
