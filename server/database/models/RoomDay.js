const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const Schema = mongoose.Schema;

const RoomGuestSchema = new Schema(
  {
    _id: { type: Number, required: true }, // Retreat Guru reservation id
    name: { type: String, required: true },
    isSpecial: { type: Boolean, required: true },
  },
  {
    discriminatorKey: 'is',
  }
);

const RoomDaySchema = new Schema({
  room: { type: Number, ref: 'Room', required: true },
  date: { type: String, required: true },

  housekeeper: String,
  priority: Number,
  comments: [String],

  guests: [RoomGuestSchema],
});

RoomDaySchema.post('save', function() {
  cachegoose.clearCache('Rooms');
});

// Make the combination of roomId/date unique
RoomDaySchema.index({ room: 1, date: 1 }, { unique: true });

RoomDaySchema.path('guests').discriminator(
  'ArrivingRoomGuest',
  new Schema({
    flightTime: Date,
    movingFrom: String,
    givenRoomKey: Boolean,
    givenRoomKeyAt: Date,
    givenRoomKeyBy: String,
  })
);

RoomDaySchema.path('guests').discriminator(
  'DepartingRoomGuest',
  new Schema({
    flightTime: Date,
    movingTo: String,
    lateCheckout: String,
  })
);

RoomDaySchema.path('guests').discriminator('StayingRoomGuest', new Schema({}));

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

RoomDaySchema.statics.reconcile = async function(proposed, date) {
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

RoomDaySchema.statics.giveKey = async function(roomId, guestId, date, user) {
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
    room =>
      room.guests &&
      -room.guests.filter(guest => guest.is === 'ArrivingRoomGuest').length,
  ]);

  for (let [i, room] of prioritizedRoomDays.entries()) {
    room.priority = i + 1;
    await room.save();
  }

  return prioritizedRoomDays;
};

module.exports = mongoose.model('RoomDay', RoomDaySchema);
