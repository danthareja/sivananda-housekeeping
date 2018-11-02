const _ = require('lodash');
const moment = require('moment');
const axios = require('axios');
const { RoomDay } = require('../models');

const retreatGuru = axios.create({
  baseURL: process.env.RETREAT_GURU_API_URL,
  headers: {
    'Cache-Control': 'no-cache',
  },
  params: {
    token: process.env.RETREAT_GURU_API_TOKEN,
  },
});

const roomProgramCategories = {
  attc: true,
  children: true,
  ky: true,
  ttc: true,
  speaker: true,
  'yvp-lodging': true,
};

const getRoomRegistrations = async date => {
  const { data } = await retreatGuru.get('/registrations', {
    params: {
      limit: 0,
      min_stay: date,
      max_stay: date,
    },
  });

  return data.filter(
    registration =>
      (registration.status === 'reserved' ||
        registration.status === 'arrived' ||
        registration.status === 'checked-out') &&
      registration.program_categories.some(
        category => roomProgramCategories[category]
      )
  );
};

const formatFlightTime = (date, timeish) => {
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
};

const seed = async (date = moment().format('YYYY-MM-DD')) => {
  console.log(`seeding from Retreat Guru on ${date}`);
  const registrations = await getRoomRegistrations(date);
  const [arrivingOrDeparting, staying] = _.partition(
    registrations,
    registration =>
      registration.start_date === date || registration.end_date === date
  );
  const stayingByRoomId = _.groupBy(staying, 'room_id');

  const roomDays = _.chain(arrivingOrDeparting)
    .groupBy('room_id')
    .map((registrations, roomId) => {
      const staying = stayingByRoomId[roomId];
      const [arriving, departing] = _.partition(
        registrations,
        registration => registration.start_date === date
      );
      const arrivingById = _.keyBy(arriving, 'id');
      const departingById = _.keyBy(departing, 'id');

      const guests = _.concat(
        arriving.map(registration => ({
          is: 'ArrivingRoomGuest',
          _id: registration.id,
          name: registration.full_name,
          isSpecial: registration.program_categories.indexOf('speaker') > -1,
          flightTime: formatFlightTime(
            date,
            registration.questions.flight_arrival_time_in_nassau_2
          ),
          movingFrom: departingById[registration.id]
            ? departingById[registration.id].room
            : undefined,
        })),
        departing.map(registration => ({
          is: 'DepartingRoomGuest',
          _id: registration.id,
          name: registration.full_name,
          isSpecial: registration.program_categories.indexOf('speaker') > -1,
          flightTime: formatFlightTime(
            date,
            registration.questions.flight_departure_time_from_nassau
          ),
          movingFrom: arrivingById[registration.id]
            ? arrivingById[registration.id].room
            : undefined,
        }))
      );

      if (staying) {
        guests.push(
          staying.map(registration => ({
            is: 'StayingRoomGuest',
            _id: registration.id,
            name: registration.full_name,
            isSpecial: registration.program_categories.indexOf('speaker') > -1,
          }))
        );
      }

      return {
        room: parseInt(roomId), // It got converted to a string as an object key in groupBy
        date,
        guests,
      };
    })
    .value();

  await RoomDay.reconcile(roomDays, date);
  console.log(`done seeding from Retreat Guru on ${date}`);
};

module.exports = seed;
