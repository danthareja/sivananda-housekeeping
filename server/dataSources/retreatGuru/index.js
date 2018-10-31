const _ = require('lodash');
const { RESTDataSource } = require('apollo-datasource-rest');

class RetreatGuruAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.RETREAT_GURU_API_URL;
  }

  willSendRequest(request) {
    request.params.set('token', process.env.RETREAT_GURU_API_TOKEN);
    request.headers.set('Cache-Control', 'no-cache');
  }

  async getRoomRegistrations(date) {
    const roomCategories = {
      attc: true,
      children: true,
      ky: true,
      ttc: true,
      speaker: true,
      'yvp-lodging': true,
    };

    const registrations = await this.get(
      '/registrations',
      {
        limit: 0,
        min_stay: date,
        max_stay: date,
      },
      {
        cacheOptions: {
          ttl: 60,
        },
      }
    );

    return registrations.filter(
      registration =>
        (registration.status === 'reserved' ||
          registration.status === 'arrived' ||
          registration.status === 'checked-out') &&
        registration.program_categories.some(
          category => roomCategories[category]
        )
    );
  }
}

module.exports = RetreatGuruAPI;
