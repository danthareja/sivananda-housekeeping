import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { message, Table } from 'antd';

import columns from './columns';
import title from './title/index.js'; // not sure why index.js is needed here...

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      lodgingId
      lodgingName
      location
      cleaningTime
      cleaningCartCost
      cleaned
      cleanedAt
      givenKey
      givenKeyAt
      housekeeper
      priority
      comments
      arrivingGuests {
        id
        name
        isSpecial
        flightTime
        movingFrom
      }
      departingGuests {
        id
        name
        isSpecial
        flightTime
        movingTo
      }
      stayingGuests {
        id
        name
        isSpecial
      }
    }
  }
`;

const RoomTable = () => (
  <Query query={GET_ROOMS} pollInterval={3000}>
    {({ loading, error, data }) => {
      if (error) {
        message.error(error.message);
        return <Table dataSource={[]} columns={columns} />;
      }

      return (
        <Table
          dataSource={
            data.rooms && data.rooms.sort((a, b) => a.priority - b.priority)
          }
          columns={columns}
          title={title}
          loading={loading}
          rowKey="id"
        />
      );
    }}
  </Query>
);

export default RoomTable;
