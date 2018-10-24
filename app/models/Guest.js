class Guest {
  constructor(registration) {
    this.registration = registration;
  }

  id() {
    return this.registration.id;
  }

  name() {
    return this.registration.full_name;
  }

  isSpecial() {
    return this.registration.program_categories.indexOf('speaker') > -1;
  }
}

module.exports = Guest;
