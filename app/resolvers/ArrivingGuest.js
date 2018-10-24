module.exports = {
  ArrivingGuest: {
    id(guest, _, ctx) {
      return guest.id();
    },
    name(guest, _, ctx) {
      return guest.name();
    },
    isSpecial(guest, _, ctx) {
      return guest.isSpecial();
    },
    flightTime(guest, _, ctx) {
      return guest.flightTime();
    },
    movingFrom(guest, _, ctx) {
      return guest.movingFrom();
    },
  },
};
