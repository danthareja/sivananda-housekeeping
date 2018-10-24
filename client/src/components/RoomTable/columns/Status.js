import React from 'react';
import { Tooltip, Icon } from 'antd';
import moment from 'moment';

// Colors from: https://ant.design/docs/react/customize-theme
export default {
  title: 'Status',
  key: 'status',
  width: '150px',
  render: (text, room) => (
    <div>
      <div>
        <Tooltip title={
          room.cleanedAt
            ? `Last cleaned ${moment(room.cleanedAt).fromNow()}`
            : 'Never cleaned'
          }
        >
          {room.dirty
            ? <span style={{color: '#f5222d'}}>Dirty</span>
            : <span style={{color: '#52c41a'}}>Clean</span>
          }
        </Tooltip>
      </div>
      <div>
        {room.givenKey
          ? <span style={{color: '#52c41a'}}>with keys</span>
          : <span style={{color: '#f5222d'}}>without keys</span>
        }
      </div>
    </div>
  )
}