const { Room } = require('../models');

module.exports = {
  Query: {
    rooms(root, args, ctx) {
      return Room.query(ctx);
    },
  }
};
