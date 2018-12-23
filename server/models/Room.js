const _ = require('lodash');
const moment = require('moment');

class Room {
  constructor(roomDayGuests, roomDay) {
    this.roomDayGuests = roomDayGuests;
    this.roomDay = roomDay;
  }

  arrivingGuests() {
    return this.roomDayGuests.arrivingGuests.map(guest => {
      const key = this.roomDay.keys.find(key => key.givenTo === guest.id);
      return Object.assign({}, guest, {
        givenRoomKey: Boolean(key),
        givenRoomKeyBy: key ? key.givenBy : null,
        givenRoomKeyAt: key ? key.givenAt : null,
      });
    });
  }

  departingGuests() {
    return this.roomDayGuests.departingGuests;
  }

  stayingGuests() {
    return this.roomDayGuests.stayingGuests;
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
            .populate('room')
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
        .populate('room')
        .exec(),
    ]);

    return new Room(roomDayGuests, roomDay);
  }

  static async clean(ctx, id, date) {
    const { database, retreatGuru } = ctx.dataSources;

    const [roomDayGuests, room, roomDay] = await Promise.all([
      retreatGuru.getRoomDayGuests(date, id),
      database.Room.clean(id, ctx.user.name),
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

    const roomDayGuests = await retreatGuru.getRoomDayGuests(date, id);
    const roomDay = await database.RoomDay.findOne({
      room: id,
      date,
    })
      .populate('room')
      .exec();

    const index = roomDay.keys.findIndex(key => key.givenTo === guestId);
    if (index > -1) {
      roomDay.keys.splice(index, 1);
    } else {
      roomDay.keys.push({
        givenTo: guestId,
        givenBy: ctx.user.name,
        givenAt: new Date(),
      });
    }

    await roomDay.save();

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
