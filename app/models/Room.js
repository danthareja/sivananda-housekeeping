const _ = require('lodash');
const moment = require('moment');
const ArrivingGuest = require('./ArrivingGuest');
const DepartingGuest = require('./DepartingGuest');
const StayingGuest = require('./StayingGuest');

class Room {
  constructor(room, registrations) {
    this.room = room;
    this.registrations = registrations.filter(
      r => r.room_id === room.retreatGuruId
    );
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
    return this.room.retreatGuruId;
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
    return this.room.cleaned;
  }

  cleanedAt() {
    return this.room.cleanedAt;
  }

  givenKey() {
    return this.room.givenKey;
  }

  givenKeyAt() {
    return this.room.givenKeyAt;
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
    const date = moment().format('YYYY-MM-DD');
    return this.registrations
      .filter(registration => registration.start_date === date)
      .map(registration => {
        const movingFromRegistration = this.registrationsByGuest[
          this._uniqueGuestKey(registration)
        ].find(registration => registration.end_date === date);
        return new ArrivingGuest(registration, movingFromRegistration);
      });
  }

  departingGuests() {
    const date = moment().format('YYYY-MM-DD');
    return this.registrations
      .filter(registration => registration.end_date === date)
      .map(registration => {
        const movingToRegistration = this.registrationsByGuest[
          this._uniqueGuestKey(registration)
        ].find(registration => registration.start_date === date);
        return new DepartingGuest(registration, movingToRegistration);
      });
  }

  stayingGuests() {
    const date = moment().format('YYYY-MM-DD');
    return this.registrations
      .filter(
        registration =>
          registration.end_date !== date && registration.start_date !== date
      )
      .map(registration => new StayingGuest(registration));
  }

  // Queries

  static async fetch(ctx) {
    const date = moment().format('YYYY-MM-DD');

    const [rooms, registrations] = await Promise.all([
      ctx.dataSources.prisma.rooms(),
      ctx.dataSources.retreatGuruAPI.getRoomRegistrations(date),
    ]);

    const roomsById = _.keyBy(rooms, 'retreatGuruId');
    return (
      _.chain(registrations)
        // We only want to return rooms that have arrivals or departures today
        // But we need to use registrations for all dates to calculate room moves
        .filter(
          registration =>
            registration.start_date === date || registration.end_date === date
        )
        .groupBy('room_id')
        .map((_, roomId) => {
          if (!roomsById[roomId]) {
            throw new Error(
              `Room ${roomId} does not exist in the database yet. Please add it.`
            );
          }
          return new Room(roomsById[roomId], registrations);
        })
        .value()
    );
  }

  static async fetchById(ctx, id) {
    const date = moment().format('YYYY-MM-DD');

    const [room, registrations] = await Promise.all([
      ctx.dataSources.prisma.room({
        retreatGuruId: id,
      }),
      ctx.dataSources.retreatGuruAPI.getRoomRegistrations(date),
    ]);
    return new Room(room, registrations);
  }

  // Mutations

  static async clean(ctx, id) {
    const room = await Room.fetchById(ctx, id);
    const cleaned = room.cleaned();
    const cleanedAt = room.cleanedAt();

    return new Room(
      await ctx.dataSources.prisma.updateRoom({
        data: {
          cleaned: !cleaned,
          cleanedAt: cleaned ? cleanedAt : new Date(),
        },
        where: {
          retreatGuruId: id,
        },
      }),
      room.registrations
    );
  }

  static async giveKey(ctx, id) {
    const room = await Room.fetchById(ctx, id);
    const givenKey = room.givenKey();
    const givenKeyAt = room.givenKeyAt();

    return new Room(
      await ctx.dataSources.prisma.updateRoom({
        data: {
          givenKey: !givenKey,
          givenKeyAt: givenKey ? givenKeyAt : new Date(),
        },
        where: {
          retreatGuruId: id,
        },
      }),
      room.registrations
    );
  }

  static async automaticallyPrioritize(ctx) {
    const rooms = _.sortBy(await Room.fetch(ctx), [
      room => room._earliestArrivalTime(),
      room => -room.arrivingGuests().length,
    ]);

    // TODO: speed this up with some concurrency
    let updated = [];
    for (let [index, room] of rooms.entries()) {
      updated.push(
        new Room(
          await ctx.dataSources.prisma.updateRoom({
            data: {
              priority: index + 1,
            },
            where: {
              retreatGuruId: room.id(),
            },
          }),
          room.registrations
        )
      );
    }

    return updated;
  }
}

module.exports = Room;
