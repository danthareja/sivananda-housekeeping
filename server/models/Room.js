const _ = require('lodash');
const moment = require('moment');
const ArrivingGuest = require('./ArrivingGuest');
const DepartingGuest = require('./DepartingGuest');
const StayingGuest = require('./StayingGuest');

class Room {
  constructor(room, reservation, registrations) {
    this.room = room;
    this.reservation = reservation;
    this.registrations = registrations.filter(r => r.room_id === room.room_id);
    this.registrationsByGuest = _.groupBy(registrations, this._uniqueGuestKey);
  }

  _uniqueGuestKey(registration) {
    return `${registration.full_name}`;
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
    return this.room.room_id;
  }

  name() {
    return this.room.room_name;
  }

  lodgingId() {
    return this.room.lodging_id;
  }

  lodgingName() {
    return this.room.lodging_name;
  }

  location() {
    return this.room.location;
  }

  cleaningTime() {
    return this.room.cleaning_time;
  }

  cleaningCartCost() {
    return this.room.cleaning_cart_cost;
  }

  cleaned() {
    return this.reservation.cleaned;
  }

  cleanedAt() {
    return this.reservation.cleanedAt;
  }

  givenKey() {
    return this.reservation.givenKey;
  }

  givenKeyAt() {
    return this.reservation.givenKeyAt;
  }

  housekeeper() {
    return this.reservation.housekeeper;
  }

  priority() {
    return this.reservation.priority;
  }

  comments() {
    return this.reservation.comments;
  }

  arrivingGuests() {
    return this.registrations
      .filter(registration => registration.start_date === this.reservation.date)
      .map(registration => {
        const movingFromRegistration = this.registrationsByGuest[
          this._uniqueGuestKey(registration)
        ].find(registration => registration.end_date === this.reservation.date);
        return new ArrivingGuest(registration, movingFromRegistration);
      });
  }

  departingGuests() {
    return this.registrations
      .filter(registration => registration.end_date === this.reservation.date)
      .map(registration => {
        const movingToRegistration = this.registrationsByGuest[
          this._uniqueGuestKey(registration)
        ].find(
          registration => registration.start_date === this.reservation.date
        );
        return new DepartingGuest(registration, movingToRegistration);
      });
  }

  stayingGuests() {
    return this.registrations
      .filter(
        registration =>
          registration.end_date !== this.reservation.date &&
          registration.start_date !== this.reservation.date
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
          !registration.room.includes('Tent Space')
      )
      .map(registration => registration.room_id)
      .uniq()
      .value();

    return Promise.all(
      roomIds.map(async roomId => {
        const room = ctx.dataSources.local.getRoom(roomId);
        const reservation = await ctx.dataSources.database.getReservation(
          roomId,
          date
        );
        return new Room(room, reservation, registrations);
      })
    );
  }

  static async fetchById(ctx, id, date = moment().format('YYYY-MM-DD')) {
    const [room, reservation, registrations] = await Promise.all([
      ctx.dataSources.local.getRoom(id),
      ctx.dataSources.database.getReservation(id, date),
      ctx.dataSources.retreatGuru.getRoomRegistrations(date),
    ]);
    return new Room(room, reservation, registrations);
  }

  // Mutations

  static async clean(ctx, id, date = moment().format('YYYY-MM-DD')) {
    const [room, reservation, registrations] = await Promise.all([
      ctx.dataSources.local.getRoom(id),
      ctx.dataSources.database.clean(id, date),
      ctx.dataSources.retreatGuru.getRoomRegistrations(date),
    ]);
    return new Room(room, reservation, registrations);
  }

  static async giveKey(ctx, id, date = moment().format('YYYY-MM-DD')) {
    const [room, reservation, registrations] = await Promise.all([
      ctx.dataSources.local.getRoom(id),
      ctx.dataSources.database.giveKey(id, date),
      ctx.dataSources.retreatGuru.getRoomRegistrations(date),
    ]);
    return new Room(room, reservation, registrations);
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
          room.room,
          await ctx.dataSources.database.prioritize(room.id(), date, index + 1),
          room.registrations
        );
      })
    );
  }
}

module.exports = Room;
