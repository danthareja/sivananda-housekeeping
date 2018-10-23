const _ = require('lodash');
const moment = require('moment');
const ArrivingGuest = require('./ArrivingGuest')
const DepartingGuest = require('./DepartingGuest')

class Room {
  constructor(room, registrations) {
    this.room = room;
    this.registrations = registrations;
    this.registrationsByGuest = _.groupBy(registrations, this._uniqueGuestKey)
  }

  _uniqueGuestKey(registration) {
    return `${registration.full_name}`;
  }

  getId() {
    return this.room.retreatGuruId;
  }

  getName() {
    return this.room.name;
  }

  getLodgingId() {
    return this.room.lodgingId;
  }

  getLodgingName() {
    return this.room.lodgingName;
  }

  getLocation() {
    return this.room.location;
  }

  getCleaningTime() {
    return this.room.cleaningTime;
  }

  getCartCost() {
    return this.room.cartCost;
  }

  getDirty() {
    return this.room.dirty;
  }

  getGivenKey() {
    return this.room.givenKey;
  }

  getCleanedAt() {
    return this.room.cleanedAt;
  }

  getHousekeeper() {
    return this.room.housekeeper;
  }

  getOrder() {
    return this.room.order;
  }

  getComments() {
    return this.room.comments;
  }

  getArrivals() {
    const date = moment().format('YYYY-MM-DD');
    return this.registrations
      .filter(registration => registration.start_date === date)
      .map(registration => {
        const movingFromRegistration = this.registrationsByGuest[this._uniqueGuestKey(registration)].find(registration => registration.end_date === date)
        return new ArrivingGuest(registration, movingFromRegistration)
      })
  }

  getDepartures() {
    const date = moment().format('YYYY-MM-DD');
    return this.registrations
      .filter(registration => registration.end_date === date)
      .map(registration => {
        const movingToRegistration = this.registrationsByGuest[this._uniqueGuestKey(registration)].find(registration => registration.start_date === date)
        return new DepartingGuest(registration, movingToRegistration)
      })
  }

  static async fetch(ctx) {
    const [rooms, registrations] = await Promise.all([
      ctx.prisma.rooms(),
      ctx.retreatGuru.getRoomRegistrations()
    ]);

    const roomsById = _.keyBy(rooms, 'retreatGuruId')
    return _.chain(registrations)
      .groupBy('room_id')
      .map((registrations, roomId) => {
        if (!roomsById[roomId]) {
          throw new Error(`Room ${roomId} does not exist in the database yet. Please add it.`)
        }
        return new Room(roomsById[roomId], registrations);
      })
      .value();
  }
}

module.exports = Room;