class Guest {
  constructor(guest, roomDay) {
    this.guest = guest;
    this.roomDay = roomDay;
  }

  id() {
    return this.guest.id;
  }

  name() {
    return this.guest.name;
  }

  isSpecial() {
    return this.guest.isSpecial;
  }
}

module.exports = Guest;
