const { Room } = require('../models');

module.exports = {
  Room: {
    id(room, _, ctx) {
      return room.getId();
    },
    name(room, _, ctx) {
      return room.getName();
    },
    dirty(room, _, ctx) {
      return room.getDirty();
    },
    givenKey(room, _, ctx) {
      return room.getGivenKey();
    },
    cleaningTime(room, _, ctx) {
      return room.getCleaningTime();
    },
    cleanedAt(room, _, ctx) {
      return room.getCleanedAt();
    },
    housekeeper(room, _, ctx) {
      return room.getHousekeeper();
    },
    order(room, _, ctx) {
      return room.getOrder();
    },
    comments(room, _, ctx) {
      return room.getComments();
    },
    arrivals(room, _, ctx) {
      return room.getArrivals();
    },
    departures(room, _, ctx) {
      return room.getDepartures()
    }
  }
};
