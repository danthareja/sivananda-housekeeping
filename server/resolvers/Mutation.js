const moment = require('moment');

module.exports = {
  Mutation: {
    async automaticallyPrioritizeRooms(
      root,
      { date = moment().format('YYYY-MM-DD') },
      ctx
    ) {
      return ctx.db.RoomDay.automaticallyPrioritize(date);
    },
    async cleanRoom(
      root,
      { roomId, date = moment().format('YYYY-MM-DD') },
      ctx
    ) {
      const room = await ctx.db.Room.clean(roomId, ctx.user.name);
      const roomDay = await ctx.db.RoomDay.findOne({
        room: roomId,
        date,
      }).exec();
      roomDay.room = room;
      return roomDay;
    },
    async giveRoomKey(
      root,
      { roomId, guestId, date = moment().format('YYYY-MM-DD') },
      ctx
    ) {
      return ctx.db.RoomDay.giveKey(date, roomId, guestId, ctx.user.name);
    },
  },
};
