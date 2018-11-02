#!/usr/bin/env node

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: '.env.local',
  });
}

const axios = require('axios');
const moment = require('moment');

const graphqlUrl =
  process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
const authUrl = 'https://lingering-cloud-1820.auth0.com/oauth/token';

const query = `
mutation AutomaticallyPrioritizeRooms($date:String) {
  automaticallyPrioritizeRooms(date:$date){
    id
  }
}
`;

const variables = {
  date: process.argv[2] || moment().format('YYYY-MM-DD'),
};

(async () => {
  console.log(`Autoprioritizing for ${variables.date}`);

  try {
    const {
      data: { access_token },
    } = await axios.post(authUrl, {
      client_id: process.env.AUTH0_MACHINE_CLIENT_ID,
      client_secret: process.env.AUTH0_MACHINE_CLIENT_SECRET,
      audience: 'https://sivananda-housekeeping.herokuapp.com',
      grant_type: 'client_credentials',
    });

    await axios.post(
      graphqlUrl,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log('success!');
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    } else {
      console.log(e);
    }
  }
})();
