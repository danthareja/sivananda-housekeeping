import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName';
import RoomKeyButton from './components/RoomKeyButton';

// Colors from: https://ant.design/docs/react/customize-theme
export default function(context) {
  return {
    title: 'Arrivals',
    key: 'arrivals',
    render: (text, room) => {
      return (
        <div>
          <ArrivingGuestList roomId={room.id} guests={room.arrivingGuests} />
        </div>
      );
    },
  };
}

const ArrivingGuestList = ({ roomId, guests }) => {
  if (guests.length === 0) {
    return <span style={{ color: '#52c41a' }}>None</span>;
  }

  return (
    <List
      size="small"
      dataSource={guests}
      renderItem={guest => (
        <List.Item>
          <ArrivingGuest roomId={roomId} guest={guest} />
        </List.Item>
      )}
    />
  );
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
