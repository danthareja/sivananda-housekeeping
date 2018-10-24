const _ = require('lodash');
const moment = require('moment');
const ArrivingGuest = require('./ArrivingGuest');
const DepartingGuest = require('./DepartingGuest');
const StayingGuest = require('./StayingGuest');

class Room {
  constructor(room, registrations) {
    this.room = room;
    this.registrations = registrations;
    this.registrationsByGuest = _.groupBy(registrations, this._uniqueGuestKey);
  }

  _uniqueGuestKey(registration) {
    return `${registration.full_name}`;
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

  order() {
    return this.room.order;
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

  static async fetch(ctx) {
    const [rooms, registrations] = await Promise.all([
      ctx.dataSources.prisma.rooms(),
      ctx.dataSources.retreatGuruAPI.getRoomRegistrations(),
    ]);

    const roomsById = _.keyBy(rooms, 'retreatGuruId');
    return _.chain(registrations)
      .groupBy('room_id')
      .map((registrations, roomId) => {
        if (!roomsById[roomId]) {
          throw new Error(
            `Room ${roomId} does not exist in the database yet. Please add it.`
          );
        }
        return new Room(roomsById[roomId], registrations);
      })
      .value();
  }

  static async clean(ctx, id) {
    let [room, registrations] = await Promise.all([
      ctx.dataSources.prisma.room({
        retreatGuruId: id,
      }),
      ctx.dataSources.retreatGuruAPI.getRoomRegistrations(id),
    ]);

    const update = {
      data: {
        cleaned: !room.cleaned,
      },
      where: {
        retreatGuruId: id,
      },
    };

    if (!room.cleaned) {
      update.data.cleanedAt = new Date();
    }

    room = await ctx.dataSources.prisma.updateRoom(update);

    return new Room(room, registrations);
  }

  static async giveKey(ctx, id) {
    let [room, registrations] = await Promise.all([
      ctx.dataSources.prisma.room({
        retreatGuruId: id,
      }),
      ctx.dataSources.retreatGuruAPI.getRoomRegistrations(id),
    ]);

    const update = {
      data: {
        givenKey: !room.givenKey,
      },
      where: {
        retreatGuruId: id,
      },
    };

    if (!room.givenKey) {
      update.data.givenKeyAt = new Date();
    }

    room = await ctx.dataSources.prisma.updateRoom(update);

    return new Room(room, registrations);
  }

  static async findById(ctx, id) {
    const [room, registrations] = await Promise.all([
      ctx.dataSources.prisma.room({
        retreatGuruId: id,
      }),
      ctx.dataSources.retreatGuruAPI.getRoomRegistrations(id),
    ]);
    return new Room(room, registrations);
  }
}

module.exports = Room;
