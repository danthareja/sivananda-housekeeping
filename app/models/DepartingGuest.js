const _ = require('lodash');
const Guest = require('./Guest');

class DepartingGuest extends Guest {
  constructor(registration, movingToRegistration) {
    super(registration);
    this.movingToRegistration = movingToRegistration;
  }

  flightTime() {
    return this._formatFlightTime(
      this.registration.end_date,
      this.registration.questions.flight_departure_time_from_nassau
    );
  }

  // TODO
  lateCheckout() {
    return false;
  }

  // Using _.get returns gracefully when movingFromRegistration is undefined
  movingTo() {
    return _.get(this.movingToRegistration, 'room');
  }
}

module.exports = DepartingGuest;
