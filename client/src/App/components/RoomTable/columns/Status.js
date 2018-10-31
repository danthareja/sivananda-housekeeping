import React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';

// Colors from: https://ant.design/docs/react/customize-theme
export default {
  title: 'Status',
  key: 'status',
  render: (text, room) => (
    <div>
      <div>
        <Tooltip
          placement="right"
          title={
            room.cleanedAt
              ? `Last cleaned ${moment(room.cleanedAt).fromNow()} by ${
                  room.cleanedBy
                }`
              : 'Never cleaned'
          }
        >
          {room.cleaned ? (
            <span style={{ color: '#52c41a' }}>Clean</span>
          ) : (
            <span style={{ color: '#f5222d' }}>Dirty</span>
          )}
        </Tooltip>
      </div>
    </div>
  ),
};
