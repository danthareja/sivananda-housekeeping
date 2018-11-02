const moment = require('moment');

module.exports = {
  Query: {
    async rooms(root, { date = moment().format('YYYY-MM-DD') }, ctx) {
      return ctx.db.RoomDay.find({ date })
        .cache(0, 'Rooms')
        .populate('room')
        .lean()
        .exec();
    },
    async room(root, { id, date = moment().format('YYYY-MM-DD') }, ctx) {
      return ctx.db.RoomDay.findOne({ room: id, date })
        .populate('room')
        .lean()
        .exec();
    },
  },
};
