import React, { Component } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';
import { message, Table, DatePicker } from 'antd';

import columns from './columns';

import './index.css';

const GET_ROOMS = gql`
  query GetRooms($date: String!) {
    rooms(date: $date) {
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
    date: moment(),
  };

  handleRoomSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ roomSearchText: selectedKeys[0] });
  };

  handleRoomReset = clearFilters => () => {
    clearFilters();
    this.setState({ roomSearchText: '' });
  };

  handleDateChange = date => {
    this.setState({ date });
  };

  render() {
    const { date } = this.state;
    return (
      <Query
        query={GET_ROOMS}
        variables={{ date: date.format('YYYY-MM-DD') }}
        pollInterval={3000}
      >
        {({ loading, error, data }) => {
          if (error) {
            message.error(error.message);
            return <Table dataSource={[]} columns={columns} />;
          }

          return (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <DatePicker value={date} onChange={this.handleDateChange} />
              </div>

              <Table
                dataSource={
                  data.rooms &&
                  data.rooms.sort((a, b) => a.priority - b.priority)
                }
                columns={columns.map(column => column(this))}
                loading={loading}
                pagination={false}
                rowKey="id"
                scroll={{ x: 650 }}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default RoomTable;
