const _ = require('lodash');
const moment = require('moment');
const { RESTDataSource } = require('apollo-datasource-rest');

class RetreatGuruAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.RETREAT_GURU_API_URL;
  }

  willSendRequest(request) {
    request.params.set('token', process.env.RETREAT_GURU_API_TOKEN);
    request.headers.set('Cache-Control', 'no-cache');
    // ** undocumented feature from support **
    // eli [4:17 PM]
    // You can pass "nocache=xxx" in the URL where xxx is the current timestamp
    // or a random number to bypass the cache.
    // There are multiple layers of cache (both app side and provider side)
    // and that ensures you always get fresh data.
    request.params.set('nocache', Date.now());
  }

  removeURLParameter(url, parameter) {
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter) + '=';
      const pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (let i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
  }

  cacheKeyFor(request) {
    return this.removeURLParameter(request.url, 'nocache');
  }

  guessTime(date, timeish) {
    // TODO: format when timish is "1pm"
    if (!date || !timeish) {
      return;
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
        return guess.toDate();
      }
    }
  }

  async getRegistrations(date) {
    const roomProgramCategories = {
      attc: true,
      children: true,
      ky: true,
      ttc: true,
      speaker: true,
      'yvp-lodging': true,
      babies: true,
      'visiting-staff': true,
    };

    const registrations = await this.get(
      '/registrations',
      {
        limit: 0,
        min_stay: date,
        max_stay: date,
        include: 'all_questions',
      },
      {
        cacheOptions: {
          ttl: 60, // in seconds
        },
      }
    );

    // Registrations filtered out in this step will *never*
    // be considered in the rest of the application
    return registrations.filter(
      registration =>
        (registration.status === 'reserved' ||
          registration.status === 'arrived' ||
          registration.status === 'checked-out') &&
        registration.program_categories.some(
          category => roomProgramCategories[category]
        )
    );
  }

  async getRoomDayGuests(date, roomId) {
    const roomsDayGuests = await this.getRoomsDayGuests(date);
    return roomsDayGuests.find(roomDayGuest => roomDayGuest.room.id === roomId);
  }

  async getRoomsDayGuests(date) {
    const registrations = await this.getRegistrations(date);

    // Transform registrations into useful subsets for optimized computing of room days
    const [arrivingOrDeparting, staying] = _.partition(
      registrations,
      registration =>
        registration.start_date === date || registration.end_date === date
    );
    const [arriving, departing] = _.partition(
      arrivingOrDeparting,
      registration => registration.start_date === date
    );

    const stayingByRoomId = _.groupBy(staying, 'room_id');
    const arrivingByPersonId = _.keyBy(arriving, 'person_id');
    const departingByPersonId = _.keyBy(departing, 'person_id');

    return (
      _.chain(arrivingOrDeparting)
        // If a registration is created without a room,
        // the registration's room_id is set to 0, which does not exist.
        .filter(registration => registration.room_id !== 0)
        .groupBy('room_id')
        .map((registrations, roomId) => {
          // Because these registrations are either arriving or departing,
          // any that are not arriving must be departing
          const [arriving, departing] = _.partition(
            registrations,
            registration => registration.start_date === date
          );

          const arrivingGuests = arriving.map(registration => ({
            id: registration.id,
            name: registration.full_name,
            isSpecial:
              registration.program_categories.indexOf('speaker') > -1 ||
              registration.program_categories.indexOf('visiting-staff') > -1,
            flightTime: this.guessTime(
              date,
              registration.questions.flight_arrival_time_in_nassau_2
            ),
            roomSetup: registration.questions.room_set_up_notes,
            movingFrom: departingByPersonId[registration.person_id]
              ? departingByPersonId[registration.person_id].room
              : undefined,
          }));

          const departingGuests = departing.map(registration => ({
            id: registration.id,
            name: registration.full_name,
            isSpecial:
              registration.program_categories.indexOf('speaker') > -1 ||
              registration.program_categories.indexOf('visiting-staff') > -1,
            flightTime: this.guessTime(
              date,
              registration.questions.flight_departure_time_from_nassau
            ),
            lateCheckout: registration.questions.late_checkout,
            movingTo: arrivingByPersonId[registration.person_id]
              ? arrivingByPersonId[registration.person_id].room
              : undefined,
          }));

          const staying = stayingByRoomId[roomId];
          const stayingGuests = staying
            ? staying.map(registration => ({
                id: registration.id,
                name: registration.full_name,
                isSpecial:
                  registration.program_categories.indexOf('speaker') > -1 ||
                  registration.program_categories.indexOf('visiting-staff') >
                    -1,
              }))
            : [];

          return {
            room: {
              id: parseInt(roomId), // It got converted to a string as an object key in groupBy
              name: registrations[0].room,
              lodgingId: registrations[0].lodging_id,
              lodgingName: registrations[0].lodging,
            },
            arrivingGuests,
            departingGuests,
            stayingGuests,
          };
        })
        .value()
    );
  }
}

module.exports = RetreatGuruAPI;
