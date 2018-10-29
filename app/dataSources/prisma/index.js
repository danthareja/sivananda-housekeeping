var client;

try {
  client = require('./generated/client').prisma;
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.error(
      'Please generate the prisma client with `npx prisma generate`'
    );
    process.exit(1);
  }
  throw e;
}

const { DataSource } = require('apollo-datasource');

class PrismaAPI extends DataSource {
  constructor() {
    super();
    this._client = client;
  }

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

    reservation = await this._client.reservation({ key });
    if (reservation) {
      await this.cache.set(key, JSON.stringify(reservation));
      return reservation;
    }

    reservation = await this._client.createReservation({
      key,
      cleaned: false,
      givenKey: false,
    });
    await this.cache.set(key, JSON.stringify(reservation));
    return reservation;
  }

  async updateReservation(roomId, date, data) {
    const key = this._getKey(roomId, date);
    const reservation = await this._client.updateReservation({
      data,
      where: { key },
    });
    await this.cache.set(key, JSON.stringify(reservation));
    return reservation;
  }

  async clean(roomId, date) {
    const { cleaned, cleanedAt } = await this.getReservation(roomId, date);
    return this.updateReservation(roomId, date, {
      cleaned: !cleaned,
      cleanedAt: cleaned ? cleanedAt : new Date(),
    });
  }

  async giveKey(roomId, date) {
    const { givenKey, givenKeyAt } = await this.getReservation(roomId, date);
    return this.updateReservation(roomId, date, {
      givenKey: !givenKey,
      givenKeyAt: givenKey ? givenKeyAt : new Date(),
    });
  }

  async prioritize(roomId, date, priority) {
    return this.updateReservation(roomId, date, {
      priority,
    });
  }
}

module.exports = PrismaAPI;
