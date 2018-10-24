import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { message, Table } from 'antd';

import columns from './columns';

const GET_ROOMS = gql`
query GetRooms{
  rooms {
    id
    name
    lodgingId
    lodgingName
    location
    cleaningTime
    cartCost
    dirty
    givenKey
    cleanedAt
    housekeeper
    order
    comments
    arrivals{
      id
      name
      isSpecial
      flightTime
      movingFrom
    }
    departures{
      id
      name
      isSpecial
      flightTime
      movingTo
    }
  }
}
`;

const RoomTable = () => (
  <Query query={GET_ROOMS}>
    {({ loading, error, data }) => {
      if (error) {
        message.error(error.message)
        return <Table dataSource={[]} columns={columns} />
      }

      return <Table dataSource={data.rooms} columns={columns} loading={loading} rowKey="id" />
    }}
  </Query>
);

export default RoomTable;