import React from 'react';
import moment from 'moment';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { message, Table, Tooltip } from 'antd';
import RoomCleanButton from './RoomCleanButton'

const query = gql`
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
      movingFrom
    }
    departures{
      id
      name
      movingTo
    }
  }
}
`;

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Status',
  key: 'status',
  render: (text, room) => (
    // Colors from: https://ant.design/docs/react/customize-theme
    <Tooltip title={`Last cleaned ${moment(room.cleanedAt).fromNow()}`}>
      {room.dirty
        ? <span style={{color: '#f5222d'}}>Dirty</span>
        : <span style={{color: '#52c41a'}}>Clean</span>
      }
    </Tooltip>
  )
}, {
  title: 'Action',
  key: 'action',
  render: (text, room) => (
    <span>
      <RoomCleanButton id={room.id} />
    </span>
  ),
}];


const RoomListContainer = () => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (error) {
        message.error(error.message)
        return <Table dataSource={[]} columns={columns} />
      }

      return <Table dataSource={data.rooms} columns={columns} loading={loading} rowKey="id" />
    }}
  </Query>
);

export default RoomListContainer;