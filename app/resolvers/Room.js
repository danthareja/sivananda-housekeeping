const { Room } = require('../models');

module.exports = {
  Room: {
    id(room, _, ctx) {
      return room.getId();
    },
    name(room, _, ctx) {
      return room.getName();
    },
    lodgingId(room, _, ctx) {
      return room.getLodgingId();
    },
    lodgingName(room, _, ctx) {
      return room.getLodgingName();
    },
    location(room, _, ctx) {
      return room.getLocation();
    },
    cleaningTime(room, _, ctx) {
      return room.getCleaningTime();
    },
    cartCost(room, _, ctx) {
      return room.getCartCost();
    },
    dirty(room, _, ctx) {
      return room.getDirty();
    },
    givenKey(room, _, ctx) {
      return room.getGivenKey();
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
