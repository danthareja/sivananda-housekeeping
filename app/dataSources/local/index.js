const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const { DataSource } = require('apollo-datasource');

// Load rooms into memory
const ROOMS = parse(
  fs.readFileSync(path.join(__dirname, 'data', 'rooms.csv')),
  {
    columns: true,
    cast: true,
  }
);
const ROOMS_BY_ID = _.keyBy(ROOMS, 'room_id');

class LocalAPI extends DataSource {
  initialize({ context, cache }) {
    this.context = context;
    this.cache = cache;
  }

  getRoom(roomId) {
    const room = ROOMS_BY_ID[roomId];
    if (!room) {
      throw new Error(
        `Room ${roomId} does not exist in the local database yet. Please add it.`
      );
    }
    return room;
  }
}

module.exports = LocalAPI;
