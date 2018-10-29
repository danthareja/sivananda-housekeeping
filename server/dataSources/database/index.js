const _ = require('lodash');
const mongoose = require('mongoose');

const { DataSource } = require('apollo-datasource');
const { Reservation } = require('./models');

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
  }
);

class DatabaseAPI extends DataSource {
  initialize({ context, cache }) {
    this.context = context;
    this.cache = cache;
  }

  _getKey(roomId, date) {
    return `${roomId}:${date}`;
  }

  async getReservation(roomId, date) {
    const key = this._getKey(roomId, date);

    let reservation = await this.cache.get(key);
    if (reservation) {
      return JSON.parse(reservation);
    }

    reservation = await Reservation.findOne({
      roomId,
      date,
    })
      .lean()
      .exec();

    if (reservation) {
      await this.cache.set(key, JSON.stringify(reservation));
      return reservation;
    }

    reservation = await Reservation.create({
      roomId,
      date,
      cleaned: false,
      givenKey: false,
    });
    await this.cache.set(key, JSON.stringify(reservation));
    return reservation;
  }

  async updateReservation(roomId, date, patch) {
    const key = this._getKey(roomId, date);
    let reservation = await Reservation.findOneAndUpdate(
      { roomId, date },
      patch,
      { new: true }
    )
      .lean()
      .exec();
    await this.cache.set(key, JSON.stringify(reservation));
    return _.mapValues(
      reservation,
      value => (value instanceof Date ? value.toISOString() : value)
    );
  }

  async clean(roomId, date) {
    const { cleaned, cleanedAt } = await this.getReservation(roomId, date);
    return this.updateReservation(roomId, date, {
      cleaned: !cleaned,
      cleanedAt: cleaned ? cleanedAt : new Date().toISOString(),
    });
  }

  async giveKey(roomId, date) {
    const { givenKey, givenKeyAt } = await this.getReservation(roomId, date);
    return this.updateReservation(roomId, date, {
      givenKey: !givenKey,
      givenKeyAt: givenKey ? givenKeyAt : new Date().toISOString(),
    });
  }

  async prioritize(roomId, date, priority) {
    return this.updateReservation(roomId, date, {
      priority,
    });
  }
}

module.exports = DatabaseAPI;
