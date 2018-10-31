const _ = require('lodash');
const Guest = require('./Guest');

class ArrivingGuest extends Guest {
  constructor(registration, movingFromRegistration, guest) {
    super(registration);
    this.movingFromRegistration = movingFromRegistration;
    this.guest = guest;
  }

  flightTime() {
    return this._formatFlightTime(
      this.registration.start_date,
      this.registration.questions.flight_arrival_time_in_nassau_2
    );
  }

  // movingFromRegistration and guest can be undefined
  // using _.get returns gracefully in this case
  movingFrom() {
    return _.get(this.movingFromRegistration, 'room');
  }

  givenRoomKey() {
    return _.get(this.guest, 'givenRoomKey');
  }

  givenRoomKeyAt() {
    return _.get(this.guest, 'givenRoomKeyAt');
  }

  givenRoomKeyBy() {
    return _.get(this.guest, 'givenRoomKeyBy');
  }
}

module.exports = ArrivingGuest;
