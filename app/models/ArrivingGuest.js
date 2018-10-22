const Guest = require('./Guest');

class ArrivingGuest extends Guest {
  getFlightTime() {
    return this.registration.flight_arrival_time_in_nassau_2
  }
}

module.exports = ArrivingGuest;