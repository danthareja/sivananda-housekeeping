const { Room } = require('../models');

module.exports = {
  Mutation: {
    cleanRoom(root, { id }, ctx) {
      return Room.clean(ctx, id);
    },
    giveRoomKey(root, { id }, ctx) {
      return Room.giveKey(ctx, id);
    }
  }
};
