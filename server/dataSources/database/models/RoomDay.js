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
RoomDaySchema.post('save', function() {
  cachegoose.clearCache('Rooms');
});

// Make the combination of roomId/date unique
RoomDaySchema.index({ room: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('RoomDay', RoomDaySchema);
