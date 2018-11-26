const moment = require('moment');

module.exports = {
  Query: {
    async rooms(root, { date = moment().format('YYYY-MM-DD') }, ctx) {
      const rooms = await ctx.db.RoomDay.find({ date })
        .cache(0, 'Rooms')
        .populate('room')
        .lean()
        .exec();

      // Temporary fix - find out why room.room is sometimes null (like 2018-11-26)
      // and ideally add a error message for the client
      return rooms.filter(room => room.room);
    },
    async room(root, { id, date = moment().format('YYYY-MM-DD') }, ctx) {
      return ctx.db.RoomDay.findOne({ room: id, date })
        .populate('room')
        .lean()
        .exec();
    },
  },
};
