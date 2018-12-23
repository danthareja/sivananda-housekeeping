const moment = require('moment');

module.exports = {
  Room: {
    id(room, _, ctx) {
      return room.roomDay.room._id;
    },
    name(room, _, ctx) {
      return room.roomDay.room.name;
    },
    lodgingId(room, _, ctx) {
      return room.roomDay.room.lodgingId;
    },
    lodgingName(room, _, ctx) {
      return room.roomDay.room.lodgingName;
    },
    location(room, _, ctx) {
      return room.roomDay.room.location;
    },
    cleaningTime(room, _, ctx) {
      return room.roomDay.room.cleaningTime;
    },
    cleaningCartCost(room, _, ctx) {
      return room.roomDay.room.cleaningCartCost;
    },
    cleaned(room, _, ctx) {
      return room.roomDay.room.isClean;
    },
    cleanedAt(room, _, ctx) {
      return room.roomDay.room.lastCleanedAt
        ? moment(room.roomDay.room.lastCleanedAt).fromNow()
        : null;
    },
    cleanedBy(room, _, ctx) {
      return room.roomDay.room.lastCleanedBy;
    },
    housekeeper(room, _, ctx) {
      return room.roomDay.housekeeper;
    },
    priority(room, _, ctx) {
      return room.roomDay.priority;
    },
    comments(room, _, ctx) {
      return room.roomDay.comments;
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
