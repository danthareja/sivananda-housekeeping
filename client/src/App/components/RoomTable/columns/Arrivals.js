import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName';
import RoomKeyButton from './components/RoomKeyButton';
import Auth from '../../../../Auth/Auth';

const auth = new Auth();

// Colors from: https://ant.design/docs/react/customize-theme
export default function(context) {
  return {
    title: 'Arrivals',
    key: 'arrivals',
    render: (text, room) => {
      return (
        <div>
          <ArrivingGuestList room={room} guests={room.arrivingGuests} />
        </div>
      );
    },
  };
}

const ArrivingGuestList = ({ room, guests }) => {
  const roomSetup = guests.filter(guest => guest.roomSetup);

  if (guests.length === 0) {
    return <span style={{ color: '#52c41a' }}>None</span>;
  }

  return (
    <div>
      <List
        size="small"
        dataSource={guests}
        renderItem={guest => (
          <List.Item>
            <ArrivingGuest room={room} guest={guest} />
          </List.Item>
        )}
      />
      {roomSetup.length > 0 && <strong>Setup notes:</strong>}
      {roomSetup.length > 0 &&
        roomSetup.map(guest => <div key={guest.id}>{guest.roomSetup}</div>)}
    </div>
  );
};

const ArrivingGuest = ({ room, guest }) => (
  <div>
    <GuestName guest={guest} />
    {guest.movingFrom ? (
      <ArrivingGuestRoomMove guest={guest} />
    ) : (
      <ArrivingGuestFlightTime guest={guest} />
    )}
    {(auth.getUser().role === 'EDITOR' || auth.getUser().role === 'ADMIN') && (
      <RoomKeyButton room={room} guest={guest} />
    )}
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
