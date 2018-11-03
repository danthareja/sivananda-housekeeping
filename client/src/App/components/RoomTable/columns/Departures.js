import React from 'react';
import { List, Icon } from 'antd';
import GuestName from './components/GuestName';

// Colors from: https://ant.design/docs/react/customize-theme
export default function(context) {
  return {
    title: 'Departures',
    key: 'departure',
    width: '200px',
    filterMultiple: false,
    filters: [
      {
        text: 'Vacant',
        value: 'vacant',
      },
      {
        text: 'Occupied',
        value: 'occupied',
      },
    ],
    onFilter: (value, room) => {
      if (value === 'vacant') {
        return room.departingGuests.length === 0;
      }
      if (value === 'occupied') {
        return room.departingGuests.length > 0;
      }
      return true;
    },
    render: (text, room) => {
      return (
        <div>
          <DepartingGuestList guests={room.departingGuests} />
          <StayingGuestList guests={room.stayingGuests} />
        </div>
      );
    },
  };
}

const StayingGuestList = ({ guests }) => {
  if (guests.length === 0) {
    return null;
  }

  return (
    <div>
      <div style={{ marginRight: '8px' }}>Staying:</div>
      <List
        size="small"
        dataSource={guests}
        renderItem={guest => (
          <List.Item>
            <GuestName guest={guest} />
          </List.Item>
        )}
      />
    </div>
  );
};

const DepartingGuestList = ({ guests }) => {
  if (guests.length === 0) {
    return <span style={{ color: '#52c41a' }}>Vacant</span>;
  }
  return (
    <List
      size="small"
      dataSource={guests}
      renderItem={guest => (
        <List.Item>
          <DepartingGuest guest={guest} />
        </List.Item>
      )}
    />
  );
};

const DepartingGuest = ({ guest }) => (
  <div>
    <GuestName guest={guest} />
    {guest.movingTo ? (
      <DepartingGuestRoomMove guest={guest} />
    ) : (
      <DepartingGuestFlightTime guest={guest} />
    )}
  </div>
);

const DepartingGuestRoomMove = ({ guest }) => (
  <div>
    <Icon type="swap" style={{ marginRight: '6px' }} />
    <span>{guest.movingTo}</span>
  </div>
);

const DepartingGuestFlightTime = ({ guest }) => (
  <div>
    <span
      role="img"
      aria-label="plane-departing"
      style={{ marginRight: '6px' }}
    >
      🛫
    </span>
    {guest.flightTime ? <span>{guest.flightTime}</span> : <span>-</span>}
  </div>
);
