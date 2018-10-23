module.exports = {
  DepartingGuest: {
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
    lateCheckout(guest, _, ctx) {
      return guest.getLateCheckout();
    },
    movingTo(guest, _, ctx) {
      return guest.getMovingTo();
    }
  }
};
