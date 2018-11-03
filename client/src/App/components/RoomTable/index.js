import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { message, Table } from 'antd';

import columns from './columns';
import title from './title/index.js'; // not sure why index.js is needed here...

import './index.css';

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      lodgingName
      cleaned
      cleanedAt
      cleanedBy
      housekeeper
      priority
      comments
      arrivingGuests {
        id
        name
        isSpecial
        flightTime
        movingFrom
        givenRoomKey
        givenRoomKeyAt
        givenRoomKeyBy
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

class RoomTable extends Component {
  state = {
    roomSearchText: '',
  };

  handleRoomSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ roomSearchText: selectedKeys[0] });
  };

  handleRoomReset = clearFilters => () => {
    clearFilters();
    this.setState({ roomSearchText: '' });
  };

  render() {
    return (
      <Query query={GET_ROOMS}>
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
              columns={columns.map(column => column(this))}
              title={title}
              loading={loading}
              pagination={false}
              rowKey="id"
              scroll={{ x: 768 }}
            />
          );
        }}
      </Query>
    );
  }
}

export default RoomTable;
