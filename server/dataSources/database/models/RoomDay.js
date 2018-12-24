const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const Schema = mongoose.Schema;

const RoomDaySchema = new Schema({
  room: { type: Number, ref: 'Room', required: true }, // Retreat Guru room_id
  date: { type: String, required: true },

  housekeeper: String,
  priority: Number,
  comments: [String],

  keys: [
    {
      givenTo: Number, // guest id
      givenBy: String, // user name
      givenAt: Date,
    },
  ],
});

// We indefinitely cache this query, so we have to manually clear it on update
RoomDaySchema.post('save', function(roomDay) {
  const roomId =
    typeof roomDay.room === 'object' ? roomDay.room._id : roomDay.room;
  cachegoose.clearCache(`${roomId}:${roomDay.date}`);
});

// Make the combination of roomId/date unique
RoomDaySchema.index({ room: 1, date: 1 }, { unique: true });

RoomDaySchema.statics.giveKey = async function(date, roomId, guestId, user) {
  const roomDay = await this.findOne({
    room: roomId,
    date,
  })
    .populate('room')
    .exec();

  const index = roomDay.keys.findIndex(key => key.givenTo === guestId);

  if (index > -1) {
    roomDay.keys.splice(index, 1);
  } else {
    roomDay.keys.push({
      givenTo: guestId,
      givenBy: user,
      givenAt: new Date(),
    });
  }

  return roomDay.save();
};

module.exports = mongoose.model('RoomDay', RoomDaySchema);
