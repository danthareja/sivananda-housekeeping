import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName';
import RoomKeyButton from './components/RoomKeyButton';

// Colors from: https://ant.design/docs/react/customize-theme
export default {
  title: 'Arrivals',
  key: 'arrivals',
  render: (text, room) => {
    if (room.arrivingGuests.length === 0) {
      return <span style={{ color: '#52c41a' }}>None</span>;
    }
    return (
      <List
        size="small"
        grid={{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        dataSource={room.arrivingGuests}
        renderItem={guest => (
          <List.Item>
            <ArrivingGuest roomId={room.id} guest={guest} />
          </List.Item>
        )}
      />
    );
  },
};

const ArrivingGuest = ({ roomId, guest }) => (
  <div>
    <GuestName guest={guest} />
    {guest.movingFrom ? (
      <ArrivingGuestRoomMove guest={guest} />
    ) : (
      <ArrivingGuestFlightTime guest={guest} />
    )}
    <RoomKeyButton roomId={roomId} guest={guest} />
  </div>
);

const ArrivingGuestRoomMove = ({ guest }) => (
  <div>
    <Icon type="swap" style={{ marginRight: '6px' }} />
    <span>{guest.movingFrom}</span>
  </div>
);

const ArrivingGuestFlightTime = ({ guest }) => (
  <div>
    <span role="img" aria-label="plane-arriving" style={{ marginRight: '6px' }}>
      🛬
    </span>
    {guest.flightTime ? <span>{guest.flightTime}</span> : <span>-</span>}
  </div>
);
