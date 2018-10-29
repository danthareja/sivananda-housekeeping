const moment = require('moment');

class Guest {
  constructor(registration) {
    this.registration = registration;
  }

  // There is no validation for inputting flight times into Retreat Guru
  // This function is an attempt to parse commonly seen formats
  //
  // Examples:
  // "2:42 pm", "11:40 am ", "1320pm", "12:30", "10:55am", "12.30pm", "13:32 ", "11:00 ", "12:00 noon"

  _formatFlightTime(date, timeish) {
    if (!date || !timeish) {
      return null;
    }

    // Remove all characters not used to describe time
    // so moment has the best chance of matching
    timeish = timeish.replace(/[^APMapm0-9]/g, '');

    // Guess a few common formats
    const formats = [
      'hmma', // "242pm"  or  "154am"
      'hhmma', // "1142pm" or  "1154am"
      'kkmm', // "2242"   or  "1154"
    ];

    // Return the first guess that hits
    for (let format of formats) {
      const guess = moment(`${date} ${timeish}`, `YYYY-MM-DD ${format}`);
      if (guess.isValid()) {
        return guess;
      }
    }

    // All guesses failed
    return null;
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
