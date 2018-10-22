const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');

class RetreatGuruConnector {
  constructor() {
    this.roomCategories = {
      'attc': true,
      'children': true,
      'ky': true,
      'ttc': true,
      'speaker': true,
      'yvp-lodging': true,
    };

    this.axios = axios.create({
      baseURL: process.env.RETREAT_GURU_API_URL,
      params: {
        token: process.env.RETREAT_GURU_API_TOKEN
      }
    });
  }

  async getRoomRegistrations() {
    const date = moment().format('YYYY-MM-DD');

    const registrations = await this.axios.get('/registrations', {
      params: {
        limit: 0,
        min_stay: date,
        max_stay: date
      }
    });

    return registrations.data.filter(registration =>
      (registration.start_date === date || registration.end_date === date) &&
      (registration.status === 'reserved' || registration.status === 'arrived' || registration.status === 'checked-out') &&
      registration.program_categories.some(category => this.roomCategories[category])
    );
  }
}




module.exports = RetreatGuruConnector;