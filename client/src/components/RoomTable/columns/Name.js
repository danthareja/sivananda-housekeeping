import React from 'react';
import { Tooltip } from 'antd';

export default {
  title: 'Name',
  key: 'name',
  width: '150px',
  render: (text, room) => (
    <Tooltip title={room.lodgingName} placement="right">
      <span>{room.name}</span>
    </Tooltip>
  )
}