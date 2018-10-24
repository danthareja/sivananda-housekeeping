const _ = require('lodash')
const Guest = require('./Guest');

class ArrivingGuest extends Guest {
  constructor(registration, movingFromReservation) {
    super(registration);
    this.movingFromReservation = movingFromReservation;
  }

  flightTime() {
    return _.get(this.registration, 'questions.flight_arrival_time_in_nassau_2')
  }

  movingFrom() {
    return _.get(this.movingFromRegistration, 'room');
  }
}

module.exports = ArrivingGuest;