import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName'

// Colors from: https://ant.design/docs/react/customize-theme
export default {
  title: 'Departures',
  key: 'departure',
  render: (text, room) => {
    if (room.departures.length === 0) {
      return <span style={{color: '#52c41a'}}>Already Vacant</span>
    }
    if (room.departures.length === 1) {
      return <Departure data={room.departures[0]} />
    }
    return <List
      size="small"
      itemLayout="vertical"
      dataSource={room.departures}
      renderItem={departure => (
        <List.Item>
          <Departure data={departure} />
        </List.Item>
      )}
    />
  }
};

const Departure = ({ data }) => (
  <div>
    <GuestName guest={data} />
    {data.movingTo
      ? <DepartureRoomMove data={data} />
      : <DepartureFlightTime data={data} />
    }
  </div>
)

const DepartureRoomMove = ({ data }) => (
  <div>
    <Icon type="swap" style={{marginRight: '6px'}} />
    <span>{data.movingTo}</span>
  </div>
)

const DepartureFlightTime = ({ data }) => (
  <div>
    <Icon type="rocket" style={{marginRight: '6px'}} />
    {data.flightTime
      ? <span>{data.flightTime}</span>
      : <span>-</span>
    }
  </div>
)