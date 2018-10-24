import React from 'react';
import { Tooltip } from 'antd';

export default {
  title: 'Name',
  key: 'name',
  render: (text, room) => (
    <Tooltip title={room.lodgingName} placement="right">
      <span>{room.name}</span>
    </Tooltip>
  )
}
