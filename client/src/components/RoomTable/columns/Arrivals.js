import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName'

// Colors from: https://ant.design/docs/react/customize-theme
export default {
  title: 'Arrivals',
  key: 'arrivals',
  render: (text, room) => {
    if (room.arrivingGuests.length === 0) {
      return <span style={{color: '#52c41a'}}>None</span>
    }
    return <List
      size="small"
      grid={{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
      dataSource={room.arrivingGuests}
      renderItem={guest => (
        <List.Item>
          <ArrivingGuest guest={guest} />
        </List.Item>
      )}
    />
  }
};

const ArrivingGuest = ({ guest }) => (
  <div>
    <GuestName guest={guest} />
    {guest.movingFrom
      ? <ArrivingGuestRoomMove guest={guest} />
      : <ArrivingGuestFlightTime guest={guest} />
    }
  </div>
)

const ArrivingGuestRoomMove = ({ guest }) => (
  <div>
    <Icon type="swap" style={{marginRight: '6px'}} />
    <span>{guest.movingFrom}</span>
  </div>
)

const ArrivingGuestFlightTime = ({ guest }) => (
  <div>
    <Icon type="rocket" style={{marginRight: '6px'}} />
    {guest.flightTime
      ? <span>{guest.flightTime}</span>
      : <span>-</span>
    }
  </div>
)