import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName'

// Colors from: https://ant.design/docs/react/customize-theme
export default {
  title: 'Arrivals',
  key: 'arrivals',
  render: (text, room) => {
    if (room.arrivals.length === 0) {
      return <span style={{color: '#52c41a'}}>None</span>
    }
    if (room.arrivals.length === 1) {
      return <Arrival data={room.arrivals[0]} />
    }
    return <List
      size="small"
      itemLayout="vertical"
      dataSource={room.arrivals}
      renderItem={arrival => (
        <List.Item>
          <Arrival data={arrival} />
        </List.Item>
      )}
    />
  }
};

const Arrival = ({ data }) => (
  <div>
    <GuestName guest={data} />
    {data.movingFrom
      ? <ArrivalRoomMove data={data} />
      : <ArrivalFlightTime data={data} />
    }
  </div>
)

const ArrivalRoomMove = ({ data }) => (
  <div>
    <Icon type="swap" style={{marginRight: '6px'}} />
    <span>{data.movingFrom}</span>
  </div>
)

const ArrivalFlightTime = ({ data }) => (
  <div>
    <Icon type="rocket" style={{marginRight: '6px'}} />
    {data.flightTime
      ? <span>{data.flightTime}</span>
      : <span>-</span>
    }
  </div>
)