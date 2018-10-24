import React from 'react';
import { Divider } from 'antd';
import RoomCleanButton from './components/RoomCleanButton';
import RoomKeyButton from './components/RoomKeyButton';

export default {
  title: 'Action',
  key: 'action',
  render: (text, room) => (
    <span>
      <RoomCleanButton id={room.id} />
      <Divider type="vertical"/>
      <RoomKeyButton id={room.id} />
    </span>
  ),
}