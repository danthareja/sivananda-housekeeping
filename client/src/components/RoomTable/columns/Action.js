import React from 'react';
import RoomCleanButton from './components/RoomCleanButton';

export default {
  title: 'Action',
  key: 'action',
  render: (text, room) => (
    <span>
      <RoomCleanButton id={room.id} />
    </span>
  ),
}