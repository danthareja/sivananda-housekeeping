import React from 'react';
import { Tooltip, Input, Button } from 'antd';
import RoomCleanButton from './components/RoomCleanButton';

export default function(context) {
  return {
    title: 'Room',
    key: 'room',
    width: '150px',
    fixed: 'left',
    align: 'center',
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={ele => (context.roomSearchInput = ele)}
          placeholder="Search name"
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={context.handleRoomSearch(selectedKeys, confirm)}
        />
        <Button
          type="primary"
          onClick={context.handleRoomSearch(selectedKeys, confirm)}
        >
          Search
        </Button>
        <Button onClick={context.handleRoomReset(clearFilters)}>Reset</Button>
      </div>
    ),
    onFilter: (value, room) =>
      room.name.toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          context.roomSearchInput.focus();
        });
      }
    },
    render: (text, room) => {
      const { roomSearchText } = context.state;

      return (
        <div>
          <div>
            <Tooltip title={room.lodgingName} placement="top">
              {roomSearchText ? (
                <span style={{ fontStyle: 'bold' }}>
                  {room.name
                    .split(
                      new RegExp(
                        `(?<=${roomSearchText})|(?=${roomSearchText})`,
                        'i'
                      )
                    )
                    .map(
                      (fragment, i) =>
                        fragment.toLowerCase() ===
                        roomSearchText.toLowerCase() ? (
                          <span key={i} className="highlight">
                            {fragment}
                          </span>
                        ) : (
                          fragment
                        ) // eslint-disable-line
                    )}
                </span>
              ) : (
                <span style={{ fontStyle: 'bold' }}>{room.name}</span>
              )}
            </Tooltip>
          </div>
          <div style={{ marginTop: '6px' }}>
            <RoomCleanButton room={room} />
          </div>
        </div>
      );
    },
  };
}
