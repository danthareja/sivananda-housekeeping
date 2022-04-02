import React from 'react';
import { Tooltip, Input, Button, Icon } from 'antd';
import RoomCleanButton from './components/RoomCleanButton';
import Auth from '../../../../Auth/Auth';

const auth = new Auth();

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

      let tooltip = room.lodgingName;

      if (room.isNotInDatabase) {
        tooltip =
          'Warning! This room is not in the database. Some functionality is limited';
      }

      return (
        <div>
          <div>
            <Tooltip title={tooltip} placement="top">
              {roomSearchText ? (
                <span style={{ fontStyle: 'bold' }}>
                  {room.isNotInDatabase && <Icon type="warning" />}
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
                <span style={{ fontStyle: 'bold' }}>
                  {room.isNotInDatabase && <Icon type="warning" />}
                  {room.name}
                </span>
              )}
            </Tooltip>
          </div>
          {(auth.getUser().role === 'EDITOR' ||
            auth.getUser().role === 'ADMIN') && (
            <div style={{ marginTop: '6px' }}>
              <RoomCleanButton room={room} />
            </div>
          )}
        </div>
      );
    },
  };
}
