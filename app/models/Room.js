const _ = require('lodash');
const moment = require('moment');
const ArrivingGuest = require('./ArrivingGuest')
const DepartingGuest = require('./DepartingGuest')

class Room {
  constructor(room, registrations) {
    this.room = room;
    this.registrations = registrations;
  }

  getId() {
    return this.room.retreatGuruId;
  }

  getName() {
    return this.room.name;
  }

  getDirty() {
    return this.room.dirty;
  }

  getGivenKey() {
    return this.room.givenKey;
  }

  getCleaningTime() {
    return this.room.cleaningTime;
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
    return this.registrations
      .filter(registration => registration.start_date === moment().format('YYYY-MM-DD'))
      .map(registration => new ArrivingGuest(registration))
  }

  getDepartures() {
    return this.registrations
      .filter(registration => registration.end_date === moment().format('YYYY-MM-DD'))
      .map(registration => new DepartingGuest(registration))
  }

  static async query(ctx) {
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