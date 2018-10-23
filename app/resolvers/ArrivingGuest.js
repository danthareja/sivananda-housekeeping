module.exports = {
  ArrivingGuest: {
    id(guest, _, ctx) {
      return guest.getId();
    },
    name(guest, _, ctx) {
      return guest.getName();
    },
    flightTime(guest, _, ctx) {
      return guest.getFlightTime();
    },
    isSpecial(guest, _, ctx) {
      return guest.getIsSpecial();
    },
    movingFrom(guest, _, ctx) {
      return guest.getMovingFrom();
    }
  }
};
