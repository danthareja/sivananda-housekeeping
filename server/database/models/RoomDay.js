const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const Schema = mongoose.Schema;

const {
  RoomDayGuestSchema,
  ArrivingRoomGuestSchema,
  DepartingRoomGuestSchema,
  StayingRoomGuestSchema,
} = require('./RoomDayGuest');

const RoomDaySchema = new Schema({
  room: { type: Number, ref: 'Room', required: true }, // Retreat Guru room_id
  date: { type: String, required: true },

  housekeeper: String,
  priority: Number,
  comments: [String],

  guests: [RoomDayGuestSchema],
});

// We indefinitely cache this query, so we have to manually clear it on update
RoomDaySchema.post('save', function() {
  cachegoose.clearCache('Rooms');
});

// Make the combination of roomId/date unique
RoomDaySchema.index({ room: 1, date: 1 }, { unique: true });

RoomDaySchema.path('guests').discriminator(
  'ArrivingRoomGuest',
  ArrivingRoomGuestSchema
);
RoomDaySchema.path('guests').discriminator(
  'DepartingRoomGuest',
  DepartingRoomGuestSchema
);
RoomDaySchema.path('guests').discriminator(
  'StayingRoomGuest',
  StayingRoomGuestSchema
);

RoomDaySchema.methods._earliestArrivalTime = function() {
  const arrivals =
    this.guests &&
    this.guests.filter(
      guest => guest.is === 'ArrivingRoomGuest' && !guest.movingFrom
    );

  if (!arrivals || arrivals.length === 0) {
    return null;
  }

  return _.chain(arrivals)
    .map(arrival => {
      if (arrival.flightTime) {
        return arrival.flightTime.valueOf();
      }
      return null;
    })
    .sortBy()
    .first()
    .value();
};

RoomDaySchema.methods._numberOfArrivals = function() {
  if (!this.guests) {
    return null;
  }

  return -this.guests.filter(guest => guest.is === 'ArrivingRoomGuest').length;
};

RoomDaySchema.statics.reconcile = async function(date, proposed) {
  const existing = await this.find({ date }).exec();

  const toUpdate = _.intersectionBy(proposed, existing, 'room');
  const toCreate = _.differenceBy(proposed, existing, 'room');
  const toRemove = _.differenceBy(existing, proposed, 'room');

  for (let roomDay of toUpdate) {
    const { nModified } = await this.updateOne(
      { date, room: roomDay.room },
      roomDay
    ).exec();
    if (nModified === 1) {
      console.log(`updated roomDay ${roomDay.room} on ${roomDay.date}`);
    }
  }

  for (let roomDay of toCreate) {
    console.log(`creating roomDay ${roomDay.room} on ${roomDay.date}`);
    await this.create(roomDay);
  }

  for (let roomDay of toRemove) {
    console.log(`removing roomDay ${roomDay.room} on ${roomDay.date}`);
    await roomDay.remove();
  }
};

RoomDaySchema.statics.giveKey = async function(date, roomId, guestId, user) {
  const roomDay = await this.findOne({ room: roomId, date })
    .populate('room')
    .exec();

  const arrival = roomDay.guests.find(
    guest => guest.is === 'ArrivingRoomGuest' && guest._id === guestId
  );

  if (!arrival) {
    return roomDay;
  }

  arrival.givenRoomKey = !arrival.givenRoomKey;
  if (arrival.givenRoomKey) {
    arrival.givenRoomKeyAt = new Date();
    arrival.givenRoomKeyBy = user;
  }

  return roomDay.save();
};

RoomDaySchema.statics.automaticallyPrioritize = async function(date) {
  const roomDays = await this.find({ date })
    .populate('room')
    .exec();

  const prioritizedRoomDays = _.sortBy(roomDays, [
    room => room._earliestArrivalTime(),
    room => room._numberOfArrivals(),
  ]);

  for (let [i, room] of prioritizedRoomDays.entries()) {
    room.priority = i + 1;
    await room.save();
  }

  return prioritizedRoomDays;
};

module.exports = mongoose.model('RoomDay', RoomDaySchema);
