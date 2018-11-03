const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomDayGuestSchema = new Schema(
  {
    _id: Number, // Retreat Guru reservation_id
    name: { type: String, required: true },
    isSpecial: { type: Boolean, required: true },
  },
  {
    discriminatorKey: 'is',
  }
);

const ArrivingRoomGuestSchema = new Schema({
  flightTime: Date,
  movingFrom: String,
  givenRoomKey: Boolean,
  givenRoomKeyAt: Date,
  givenRoomKeyBy: String,
});

const DepartingRoomGuestSchema = new Schema({
  flightTime: Date,
  movingTo: String,
  lateCheckout: String,
});

const StayingRoomGuestSchema = new Schema({});

module.exports = {
  RoomDayGuestSchema,
  ArrivingRoomGuestSchema,
  DepartingRoomGuestSchema,
  StayingRoomGuestSchema,
};
