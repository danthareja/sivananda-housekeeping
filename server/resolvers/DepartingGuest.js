const moment = require('moment');

module.exports = {
  DepartingGuest: {
    id(guest, _, ctx) {
      return guest.id;
    },
    name(guest, _, ctx) {
      return guest.name;
    },
    isSpecial(guest, _, ctx) {
      return guest.isSpecial;
    },
    flightTime(guest, _, ctx) {
      return guest.flightTime ? moment(guest.flightTime).format('h:mma') : null;
    },
    lateCheckout(guest, _, ctx) {
      return guest.lateCheckout;
    },
    movingTo(guest, _, ctx) {
      return guest.movingTo;
    },
  },
};
