import React from 'react';
import RoomCleanButton from './components/RoomCleanButton';
import RoomKeyButton from './components/RoomKeyButton';

export default {
  title: 'Action',
  key: 'action',
  fixed: 'right',
  width: '110px',
  align: 'center',
  render: (text, room) => (
    <span>
      <RoomCleanButton room={room} />
      <div style={{ height: '6px' }} />
      <RoomKeyButton room={room} />
    </span>
  ),
};
