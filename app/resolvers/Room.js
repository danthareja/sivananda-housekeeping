const { Room } = require('../models');

module.exports = {
  Room: {
    id(room, _, ctx) {
      return room.id();
    },
    name(room, _, ctx) {
      return room.name();
    },
    lodgingId(room, _, ctx) {
      return room.lodgingId();
    },
    lodgingName(room, _, ctx) {
      return room.lodgingName();
    },
    location(room, _, ctx) {
      return room.location();
    },
    cleaningTime(room, _, ctx) {
      return room.cleaningTime();
    },
    cleaningCartCost(room, _, ctx) {
      return room.cleaningCartCost();
    },
    cleaned(room, _, ctx) {
      return room.cleaned();
    },
    cleanedAt(room, _, ctx) {
      return room.cleanedAt();
    },
    givenKey(room, _, ctx) {
      return room.givenKey();
    },
    givenKeyAt(room, _, ctx) {
      return room.givenKeyAt();
    },
    housekeeper(room, _, ctx) {
      return room.housekeeper();
    },
    order(room, _, ctx) {
      return room.order();
    },
    comments(room, _, ctx) {
      return room.comments();
    },
    arrivingGuests(room, _, ctx) {
      return room.arrivingGuests();
    },
    departingGuests(room, _, ctx) {
      return room.departingGuests();
    },
    stayingGuests(room, _, ctx) {
      return room.stayingGuests();
    },
  },
};
