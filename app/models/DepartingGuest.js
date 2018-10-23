const _ = require('lodash');
const Guest = require('./Guest');

class DepartingGuest extends Guest {
  constructor(registration, movingToRegistration) {
    super(registration);
    this.movingToRegistration = movingToRegistration;
  }

  getFlightTime() {
    return _.get(this.registration, 'questions.flight_departure_time_from_nassau')
  }

  // TODO
  getLateCheckout() {
    return false;
  }

  getMovingTo() {
    return _.get(this.movingToRegistration, 'room')
  }
}

module.exports = DepartingGuest;