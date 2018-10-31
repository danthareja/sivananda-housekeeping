var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  // Static data from csv file
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  lodgingId: { type: Number, required: true },
  lodgingName: { type: String, required: true },
  cleaningTime: { type: Number, required: true },
  cleaningCartCost: { type: Number, required: true },
  location: String,

  // Dynamic data
  isClean: { type: Boolean, required: true },
  lastCleanedAt: Date,
  lastCleanedBy: String,
});

module.exports = mongoose.model('Room', RoomSchema);
