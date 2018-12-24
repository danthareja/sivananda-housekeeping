const moment = require('moment');
const Guest = require('./Guest');

class DepartingGuest extends Guest {
  flightTime() {
    return this.guest.flightTime
      ? moment(this.guest.flightTime).format('h:mma')
      : null;
  }

  lateCheckout() {
    return this.guest.lateCheckout;
  }

  movingTo() {
    return this.guest.movingTo;
  }
}

module.exports = DepartingGuest;
