class Guest {
  constructor(registration) {
    this.registration = registration;
  }

  getId() {
    return this.registration.id;
  }

  getName() {
    return this.registration.full_name;
  }

  getFlightTime() {
    throw new Error('Not implemented');
  }

  getIsSpecial() {
    return this.registration.program_categories.indexOf('speaker') > -1
  }
}

module.exports = Guest;