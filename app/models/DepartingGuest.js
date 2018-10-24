const _ = require('lodash');
const Guest = require('./Guest');

class DepartingGuest extends Guest {
  constructor(registration, movingToRegistration) {
    super(registration);
    this.movingToRegistration = movingToRegistration;
  }

  flightTime() {
    return _.get(
      this.registration,
      'questions.flight_departure_time_from_nassau'
    );
  }

  // TODO
  lateCheckout() {
    return false;
  }

  movingTo() {
    return _.get(this.movingToRegistration, 'room');
  }
}

module.exports = DepartingGuest;
