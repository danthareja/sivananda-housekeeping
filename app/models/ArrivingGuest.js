const _ = require('lodash');
const Guest = require('./Guest');

class ArrivingGuest extends Guest {
  constructor(registration, movingFromReservation) {
    super(registration);
    this.movingFromReservation = movingFromReservation;
  }

  flightTime() {
    return this._formatFlightTime(
      this.registration.start_date,
      this.registration.questions.flight_arrival_time_in_nassau_2
    );
  }

  // Using _.get returns gracefully when movingFromRegistration is undefined
  movingFrom() {
    return _.get(this.movingFromRegistration, 'room');
  }
}

module.exports = ArrivingGuest;
