var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  roomId: Number, // 97
  date: String, // 2018-10-31

  cleaned: Boolean,
  cleanedAt: Date,

  givenKey: Boolean,
  givenKeyAt: Date,

  housekeeper: String,
  priority: Number,
  comments: [{ body: String, date: Date }],
});

// Make the combination of roomId/date unique
ReservationSchema.index({ roomId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
