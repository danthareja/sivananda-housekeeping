const moment = require('moment');

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
    cleanedBy(room, _, ctx) {
      return room.cleanedBy();
    },
    housekeeper(room, _, ctx) {
      return room.housekeeper();
    },
    priority(room, _, ctx) {
      return room.priority();
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
