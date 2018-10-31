const _ = require('lodash');
const moment = require('moment');
const ArrivingGuest = require('./ArrivingGuest');
const DepartingGuest = require('./DepartingGuest');
const StayingGuest = require('./StayingGuest');

class Room {
  constructor(room, registrations) {
    this.room = room;
    this.date = room.date;
    this.guests = _.keyBy(room.guests, 'name');
    this.registrations = registrations.filter(r => r.room_id === room.id);
    this.registrationsByGuest = _.groupBy(registrations, 'full_name');
  }

  _earliestArrivalTime() {
    const arrivals = this.arrivingGuests();

    if (arrivals.length === 0) {
      return null;
    }

    return _.chain(arrivals)
      .map(arrival => {
        const arrivalTime = arrival.flightTime();
        if (arrivalTime) {
          return arrivalTime.unix();
        }
        return null;
      })
      .sortBy()
      .first()
      .value();
  }

  id() {
    return this.room.id;
  }

  name() {
    return this.room.name;
  }

  lodgingId() {
    return this.room.lodgingId;
  }

  lodgingName() {
    return this.room.lodgingName;
  }

  location() {
    return this.room.location;
  }

  cleaningTime() {
    return this.room.cleaningTime;
  }

  cleaningCartCost() {
    return this.room.cleaningCartCost;
  }

  cleaned() {
    return this.room.isClean;
  }

  cleanedAt() {
    return this.room.lastCleanedAt;
  }

  cleanedBy() {
    return this.room.lastCleanedBy;
  }

  housekeeper() {
    return this.room.housekeeper;
  }

  priority() {
    return this.room.priority;
  }

  comments() {
    return this.room.comments;
  }

  arrivingGuests() {
    return this.registrations
      .filter(registration => registration.start_date === this.date)
      .map(registration => {
        const movingFromRegistration = this.registrationsByGuest[
          registration.full_name
        ].find(registration => registration.end_date === this.date);
        const guest = this.guests[registration.full_name];
        return new ArrivingGuest(registration, movingFromRegistration, guest);
      });
  }

  departingGuests() {
    return this.registrations
      .filter(registration => registration.end_date === this.date)
      .map(registration => {
        const movingToRegistration = this.registrationsByGuest[
          registration.full_name
        ].find(registration => registration.start_date === this.date);
        return new DepartingGuest(registration, movingToRegistration);
      });
  }

  stayingGuests() {
    return this.registrations
      .filter(
        registration =>
          registration.end_date !== this.date &&
          registration.start_date !== this.date
      )
      .map(registration => new StayingGuest(registration));
  }

  // Queries

  static async fetch(ctx, date = moment().format('YYYY-MM-DD')) {
    const registrations = await ctx.dataSources.retreatGuru.getRoomRegistrations(
      date
    );

    // We only want to return rooms that have arrivals or departures today
    // But we need to use registrations for all dates to calculate room moves
    const roomIds = _.chain(registrations)
      .filter(
        registration =>
          (registration.start_date === date ||
            registration.end_date === date) &&
          !(
            registration.room.includes('Tent Space') ||
            registration.room.includes('Nassau')
          )
      )
      .map(registration => registration.room_id)
      .uniq()
      .value();

    return Promise.all(
      roomIds.map(async roomId => {
        const room = await ctx.dataSources.database.getRoom(roomId, date);
        return new Room(room, registrations);
      })
    );
  }

  static async fetchById(ctx, id, date = moment().format('YYYY-MM-DD')) {
    const [room, registrations] = await Promise.all([
      ctx.dataSources.database.getRoom(id, date),
      ctx.dataSources.retreatGuru.getRoomRegistrations(date),
    ]);
    return new Room(room, registrations);
  }

  // Mutations

  static async clean(ctx, id, date = moment().format('YYYY-MM-DD')) {
    const [room, registrations] = await Promise.all([
      ctx.dataSources.database.clean(id, date),
      ctx.dataSources.retreatGuru.getRoomRegistrations(date),
    ]);
    return new Room(room, registrations);
  }

  static async giveKey(ctx, id, guest, date = moment().format('YYYY-MM-DD')) {
    const [room, registrations] = await Promise.all([
      ctx.dataSources.database.giveKey(id, guest, date),
      ctx.dataSources.retreatGuru.getRoomRegistrations(date),
    ]);
    return new Room(room, registrations);
  }

  static async automaticallyPrioritize(
    ctx,
    date = moment().format('YYYY-MM-DD')
  ) {
    const rooms = _.sortBy(await Room.fetch(ctx, date), [
      room => room._earliestArrivalTime(),
      room => -room.arrivingGuests().length,
    ]);

    return await Promise.all(
      rooms.map(async (room, index) => {
        return new Room(
          await ctx.dataSources.database.prioritize(room.id(), date, index + 1),
          room.registrations
        );
      })
    );
  }
}

module.exports = Room;
