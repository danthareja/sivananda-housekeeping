const _ = require('lodash');
const moment = require('moment');

const ArrivingGuest = require('./ArrivingGuest');
const DepartingGuest = require('./DepartingGuest');
const StayingGuest = require('./StayingGuest');

class Room {
  constructor(roomDayGuests, roomDay) {
    this.roomDayGuests = roomDayGuests;
    this.roomDay = roomDay;
  }

  id() {
    return this.roomDay.room._id;
  }

  name() {
    return this.roomDay.room.name;
  }

  lodgingId() {
    return this.roomDay.room.lodgingId;
  }

  lodgingName() {
    return this.roomDay.room.lodgingName;
  }

  location() {
    return this.roomDay.room.location;
  }

  cleaningTime() {
    return this.roomDay.room.cleaningTime;
  }

  cleaningCartCost() {
    return this.roomDay.room.cleaningCartCost;
  }

  cleaned() {
    return this.roomDay.room.isClean;
  }

  cleanedAt() {
    return this.roomDay.room.lastCleanedAt
      ? moment(this.roomDay.room.lastCleanedAt).fromNow()
      : null;
  }

  cleanedBy() {
    return this.roomDay.room.lastCleanedBy;
  }

  housekeeper() {
    return this.roomDay.housekeeper;
  }

  priority() {
    return this.roomDay.priority;
  }

  comments() {
    return Array.isArray(this.roomDay.comments) ? this.roomDay.comments : [];
  }

  arrivingGuests() {
    return this.roomDayGuests.arrivingGuests.map(
      guest => new ArrivingGuest(guest, this.roomDay)
    );
  }

  departingGuests() {
    return this.roomDayGuests.departingGuests.map(
      guest => new DepartingGuest(guest, this.roomDay)
    );
  }

  stayingGuests() {
    return this.roomDayGuests.stayingGuests.map(
      guest => new StayingGuest(guest, this.roomDay)
    );
  }

  static async fetch(ctx, date, prioritize = true) {
    const { database, retreatGuru } = ctx.dataSources;

    let roomsDayGuests = await retreatGuru.getRoomsDayGuests(date);
    if (prioritize) {
      roomsDayGuests = Room.prioritize(date, roomsDayGuests);
    }

    return Promise.all(
      roomsDayGuests.map(async roomDayGuests => {
        return new Room(
          roomDayGuests,
          await database.RoomDay.findOneAndUpdate(
            {
              room: roomDayGuests.roomId,
              date: date,
            },
            {},
            {
              new: true,
              upsert: true,
            }
          )
            .cache(0, `${roomDayGuests.roomId}:${date}`)
            .populate('room')
            .lean()
            .exec()
        );
      })
    );
  }

  static async fetchById(ctx, date, id) {
    const { database, retreatGuru } = ctx.dataSources;
    const [roomDayGuests, roomDay] = await Promise.all([
      retreatGuru.getRoomDayGuests(date, id),
      database.RoomDay.findOneAndUpdate(
        {
          room: id,
          date: date,
        },
        {},
        {
          new: true,
          upsert: true,
        }
      )
        .cache(0, `${id}:${date}`)
        .populate('room')
        .lean()
        .exec(),
    ]);

    return new Room(roomDayGuests, roomDay);
  }

  static async clean(ctx, id, date) {
    const { database, retreatGuru } = ctx.dataSources;

    const [roomDayGuests, room, roomDay] = await Promise.all([
      retreatGuru.getRoomDayGuests(date, id),
      database.Room.clean(date, id, ctx.user.name),
      database.RoomDay.findOne({
        room: id,
        date,
      }),
    ]);

    roomDay.room = room;

    return new Room(roomDayGuests, roomDay);
  }

  static async giveKey(ctx, date, id, guestId) {
    const { database, retreatGuru } = ctx.dataSources;

    const [roomDayGuests, roomDay] = await Promise.all([
      retreatGuru.getRoomDayGuests(date, id),
      database.RoomDay.giveKey(date, id, guestId, ctx.user.name),
    ]);

    return new Room(roomDayGuests, roomDay);
  }

  static prioritize(date, roomsDayGuests) {
    const [arrivals, noArrivals] = _.partition(
      roomsDayGuests,
      roomDayGuests => roomDayGuests.arrivingGuests.length > 0
    );
    const [specialGuests, mundaneGuests] = _.partition(
      arrivals,
      roomDayGuests =>
        roomDayGuests.arrivingGuests.some(guest => guest.isSpecial)
    );
    const [roomMoves, nonRoomMoves] = _.partition(
      mundaneGuests,
      roomDayGuests =>
        roomDayGuests.arrivingGuests.some(guest => guest.movingFrom)
    );
    const [withArrivalTime, withoutArrivalTime] = _.partition(
      nonRoomMoves,
      roomDayGuests =>
        roomDayGuests.arrivingGuests.some(guest => guest.flightTime)
    );
    const [arrivalsBeforeTwo, arrivalsAfterTwo] = _.partition(
      withArrivalTime,
      roomDayGuests =>
        roomDayGuests.arrivingGuests.some(
          guest =>
            guest.flightTime &&
            moment(guest.flightTime).isBefore(moment(date).hour(14))
        )
    );

    return [].concat(
      // Special guests sorted by arrival time
      _.sortBy(specialGuests, [
        guests =>
          _.sortBy(guests.arrivingGuests, guest => guest.flightTime)[0]
            .flightTime,
      ]),
      // Room moves sorted by arrival time
      roomMoves,
      // Arrivals before two sorted by arrival time
      _.sortBy(arrivalsBeforeTwo, [
        guests =>
          _.sortBy(guests.arrivingGuests, guest => guest.flightTime)[0]
            .flightTime,
      ]),
      withoutArrivalTime,
      // Arrivals after two sorted by arrival time
      _.sortBy(arrivalsAfterTwo, [
        guests =>
          _.sortBy(guests.arrivingGuests, guest => guest.flightTime)[0]
            .flightTime,
      ]),
      noArrivals
    );
  }
}

module.exports = Room;
