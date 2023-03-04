const moment = require('moment');
const Guest = require('./Guest');

class ArrivingGuest extends Guest {
  constructor(...args) {
    super(...args);
    this.key = this.roomDay.keys
      ? this.roomDay.keys.find(key => key.givenTo === this.guest.id)
      : null;
  }

  flightTime() {
    return this.guest.flightTime
      ? moment(this.guest.flightTime).format('h:mma')
      : null;
  }

  roomSetup() {
    return this.guest.roomSetup;
  }

  standardFlightTime() {
    return this.guest.standardFlightTime;
  }

  movingFrom() {
    return this.guest.movingFrom;
  }

  givenRoomKey() {
    return Boolean(this.key);
  }

  givenRoomKeyBy() {
    return this.key ? this.key.givenBy : null;
  }

  givenRoomKeyAt() {
    return this.key
      ? this.key.givenAt
        ? moment(this.key.givenAt).fromNow()
        : null
      : null;
  }
}

module.exports = ArrivingGuest;
