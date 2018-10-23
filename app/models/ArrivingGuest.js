const _ = require('lodash')
const Guest = require('./Guest');

class ArrivingGuest extends Guest {
  constructor(registration, movingFromReservation) {
    super(registration);
    this.movingFromReservation = movingFromReservation;
  }

  getFlightTime() {
    return _.get(this.registration, 'flight_arrival_time_in_nassau_2')
  }

  getMovingFrom() {
    return _.get(this.movingFromRegistration, 'room');
  }
}

module.exports = ArrivingGuest;