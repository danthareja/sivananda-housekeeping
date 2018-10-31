var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomDaySchema = new Schema({
  roomId: Number, // 97
  date: String, // 2018-11-01

  housekeeper: String,
  priority: Number,
  comments: [
    {
      body: String,
      date: Date,
    },
  ],

  guests: [
    {
      name: String,
      givenRoomKey: Boolean,
      givenRoomKeyAt: Date,
      givenRoomKeyBy: String,
    },
  ],
});

// Make the combination of roomId/date unique
RoomDaySchema.index({ roomId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('RoomDay', RoomDaySchema);
