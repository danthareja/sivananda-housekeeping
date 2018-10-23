const { Room } = require('../models');

module.exports = {
  Query: {
    rooms(root, _, ctx) {
      return Room.fetch(ctx);
    },
    room(root, { id }, ctx) {
      return Room.findById(ctx, id);
    }
  }
};
