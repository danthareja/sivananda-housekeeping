const { Room } = require('../models');

module.exports = {
  Mutation: {
    automaticallyPrioritizeRooms(root, { date }, ctx) {
      return Room.automaticallyPrioritize(ctx, date);
    },
    cleanRoom(root, { id, date }, ctx) {
      return Room.clean(ctx, id, date);
    },
    giveRoomKey(root, { id, guest, date }, ctx) {
      return Room.giveKey(ctx, id, guest, date);
    },
  },
};
