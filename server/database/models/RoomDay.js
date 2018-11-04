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

  const toUpdate = _.intersectionBy(existing, proposed, 'room');
  const toCreate = _.differenceBy(proposed, existing, 'room');
  const toRemove = _.differenceBy(existing, proposed, 'room');

  // The proposed array only contains information calculated from Retreat Guru reservations,
  // meaning that any properties only tracked in the database will not exsting on the proposed object
  //
  // For example, a proposed arriving room guests will not have a 'givenRoomKey' property,
  // but it might contain an update 'flightTime' property.
  //
  // We have to take care to only update Retreat Guru properties without modifying database-only ones

  for (let existingRoomDay of toUpdate) {
    console.log(
      `updating roomDay ${existingRoomDay.room} for ${existingRoomDay.date}`
    );
    const proposedRoomDay = proposed.find(
      roomDay => roomDay.room === existingRoomDay.room
    );

    // 1. Update the 'guests' array
    const guestsToUpdate = _.intersectionBy(
      existingRoomDay.guests,
      proposedRoomDay.guests,
      '_id'
    );
    const guestsToCreate = _.differenceBy(
      proposedRoomDay.guests,
      existingRoomDay.guests,
      '_id'
    );
    const guestsToRemove = _.differenceBy(
      existingRoomDay.guests,
      proposedRoomDay.guests,
      '_id'
    );

    // We use mutation methods on purpose to affect the existing guest's array
    // These mutations will get persisted when we call .save() on the roomDay
    for (let existingGuest of guestsToUpdate) {
      console.log(
        `updating guest ${existingGuest.name} in roomDay ${
          existingRoomDay.room
        }`
      );
      const proposedGuest = proposedRoomDay.guests.find(
        guest => guest._id === existingGuest._id
      );
      _.assign(existingGuest, proposedGuest);
    }

    for (let proposedGuest of guestsToCreate) {
      console.log(
        `adding guest ${proposedGuest.name} in roomDay ${existingRoomDay.room}`
      );
      existingRoomDay.guests.push(proposedGuest);
    }

    for (let existingGuest of guestsToRemove) {
      console.log(
        `removing guest ${existingGuest.name} in roomDay ${
          existingRoomDay.room
        }`
      );
      _.remove(
        existingRoomDay.guests,
        guest => guest._id === existingGuest._id
      );
    }

    existingRoomDay.markModified('guests');

    // 2. Update all other properties
    _.assign(existingRoomDay, _.omit(proposedRoomDay, 'guests'));

    // 3. Save the result
    await existingRoomDay.save();
  }

  for (let proposedRoomDay of toCreate) {
    console.log(
      `creating roomDay ${proposedRoomDay.room} for ${proposedRoomDay.date}`
    );
    await this.create(proposedRoomDay);
  }

  for (let existingRoomDay of toRemove) {
    console.log(
      `removing roomDay ${existingRoomDay.room} for ${existingRoomDay.date}`
    );
    await existingRoomDay.remove();
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
