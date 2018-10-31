const mongoose = require('mongoose');
const { DataSource } = require('apollo-datasource');
const { Room, RoomDay } = require('./models');
const seed = require('./seed');

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://localhost:27017/sivananda-housekeeping',
    {
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
    }
  )
  .then(seed);

class DatabaseAPI extends DataSource {
  initialize({ context, cache }) {
    this.context = context;
    this.cache = cache;
  }

  _getRoomCacheKey(roomId) {
    return `db:Room:${roomId}`;
  }

  _getRoomDayCacheKey(roomId, date) {
    return `db:RoomDay:${roomId}:${date}`;
  }

  async _getRoom(roomId) {
    const key = this._getRoomCacheKey(roomId);

    let room = await this.cache.get(key);
    if (room) {
      return JSON.parse(room);
    }

    room = await Room.findOne({ id: roomId })
      .lean()
      .exec();

    if (room) {
      const stringified = JSON.stringify(room);
      await this.cache.set(key, stringified);
      // Room.findOne returns a Room instance, but our cache returns JSON objects
      // to return a consistent response from this function,
      // we'll simulate getting is instance from the cache
      return JSON.parse(stringified);
    }

    throw new Error(`Room ${roomId} is not in the database. Please add it.`);
  }

  async _updateRoom(roomId, update) {
    const key = this._getRoomCacheKey(roomId);

    const room = await Room.findOneAndUpdate({ id: roomId }, update, {
      new: true,
    })
      .lean()
      .exec();

    const stringified = JSON.stringify(room);
    await this.cache.set(key, stringified);
    return JSON.parse(stringified);
  }

  async _getRoomDay(roomId, date) {
    const key = this._getRoomDayCacheKey(roomId, date);

    let roomDay = await this.cache.get(key);
    if (roomDay) {
      return JSON.parse(roomDay);
    }

    roomDay = await RoomDay.findOne({ roomId, date })
      .lean()
      .exec();

    if (roomDay) {
      const stringified = JSON.stringify(roomDay);
      await this.cache.set(key, stringified);
      return JSON.parse(stringified);
    }

    roomDay = await RoomDay.create({
      roomId,
      date,
    });

    const stringified = JSON.stringify(roomDay);
    await this.cache.set(key, stringified);
    return JSON.parse(stringified);
  }

  async _updateRoomDay(conditions, update) {
    const key = this._getRoomDayCacheKey(conditions.roomId, conditions.date);

    let roomDay = await RoomDay.findOneAndUpdate(conditions, update, {
      new: true,
    })
      .lean()
      .exec();

    const stringified = JSON.stringify(roomDay);
    await this.cache.set(key, JSON.stringify(roomDay));
    return JSON.parse(stringified);
  }

  async getRoom(roomId, date) {
    const [room, roomDay] = await Promise.all([
      this._getRoom(roomId),
      this._getRoomDay(roomId, date),
    ]);
    return Object.assign({}, room, roomDay);
  }

  async clean(roomId, date) {
    let _room = await this._getRoom(roomId);
    const [room, roomDay] = await Promise.all([
      this._updateRoom(roomId, {
        isClean: !_room.isClean,
        lastCleanedAt: _room.isClean ? _room.lastCleanedAt : new Date(),
        lastCleanedBy: _room.isClean
          ? _room.lastCleanedBy
          : this.context.user.name,
      }),
      this._getRoomDay(roomId, date),
    ]);
    return Object.assign({}, room, roomDay);
  }

  async giveKey(roomId, guestName, date) {
    let [room, roomDay] = await Promise.all([
      this._getRoom(roomId),
      this._getRoomDay(roomId, date),
    ]);

    const guest = roomDay.guests.find(guest => guest.name === guestName);
    if (!guest) {
      roomDay = await this._updateRoomDay(
        {
          roomId,
          date,
        },
        {
          $push: {
            guests: {
              name: guestName,
              givenRoomKey: true,
              givenRoomKeyAt: new Date(),
              givenRoomKeyBy: this.context.user.name,
            },
          },
        }
      );
    } else {
      roomDay = await this._updateRoomDay(
        {
          roomId,
          date,
          'guests.name': guestName,
        },
        {
          $set: {
            'guests.$.givenRoomKey': !guest.givenRoomKey,
            'guests.$.givenRoomKeyAt': guest.givenRoomKey
              ? guest.givenRoomKeyAt
              : new Date(),
            'guests.$.givenRoomKeyBy': guest.givenRoomKey
              ? guest.givenRoomKeyBy
              : this.context.user.name,
          },
        }
      );
    }
    return Object.assign({}, room, roomDay);
  }

  async prioritize(roomId, date, priority) {
    const [room, roomDay] = await Promise.all([
      this._updateRoom(roomId, {
        priority,
      }),
      this._getRoomDay(roomId, date),
    ]);
    return Object.assign({}, room, roomDay);
  }
}

module.exports = DatabaseAPI;
