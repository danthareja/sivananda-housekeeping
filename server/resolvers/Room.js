const moment = require('moment');

module.exports = {
  Room: {
    id(room, _, ctx) {
      return room.room._id;
    },
    name(room, _, ctx) {
      return room.room.name;
    },
    lodgingId(room, _, ctx) {
      return room.room.lodgingId;
    },
    lodgingName(room, _, ctx) {
      return room.room.lodgingName;
    },
    location(room, _, ctx) {
      return room.room.location;
    },
    cleaningTime(room, _, ctx) {
      return room.room.cleaningTime;
    },
    cleaningCartCost(room, _, ctx) {
      return room.room.cleaningCartCost;
    },
    cleaned(room, _, ctx) {
      return room.room.isClean;
    },
    cleanedAt(room, _, ctx) {
      return room.room.lastCleanedAt
        ? moment(room.room.lastCleanedAt).fromNow()
        : null;
    },
    cleanedBy(room, _, ctx) {
      return room.room.lastCleanedBy;
    },
    housekeeper(room, _, ctx) {
      return room.housekeeper;
    },
    priority(room, _, ctx) {
      return room.priority;
    },
    comments(room, _, ctx) {
      return room.comments;
    },
    arrivingGuests(room, _, ctx) {
      return room.guests
        ? room.guests.filter(guest => guest.is === 'ArrivingRoomGuest')
        : [];
    },
    departingGuests(room, _, ctx) {
      return room.guests
        ? room.guests.filter(guest => guest.is === 'DepartingRoomGuest')
        : [];
    },
    stayingGuests(room, _, ctx) {
      return room.guests
        ? room.guests.filter(guest => guest.is === 'StayingRoomGuest')
        : [];
    },
  },
};
