const { Room } = require('../models');

module.exports = {
  Mutation: {
    automaticallyPrioritizeRooms(root, _, ctx) {
      return Room.automaticallyPrioritize(ctx);
    },
    cleanRoom(root, { id }, ctx) {
      return Room.clean(ctx, id);
    },
    giveRoomKey(root, { id }, ctx) {
      return Room.giveKey(ctx, id);
    },
  },
};
