const Guest = require('./Guest');

class DepartingGuest extends Guest {
  getFlightTime() {
    return this.registration.flight_departure_time_from_nassau
  }

  // TODO
  getLateCheckout() {
    return false;
  }
}

module.exports = DepartingGuest;