const moment = require('moment');
const { Room } = require('../models');

module.exports = {
  Mutation: {
    async cleanRoom(
      root,
      { roomId, date = moment().format('YYYY-MM-DD') },
      ctx
    ) {
      return Room.clean(ctx, roomId, date);
    },
    // Rename this to "check in" or something
    async giveRoomKey(
      root,
      { roomId, guestId, date = moment().format('YYYY-MM-DD') },
      ctx
    ) {
      return Room.giveKey(ctx, date, roomId, guestId);
    },
  },
};
