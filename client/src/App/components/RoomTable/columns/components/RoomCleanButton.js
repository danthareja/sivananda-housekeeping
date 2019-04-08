import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { message, Button, Tooltip } from 'antd';

const CLEAN_ROOM = gql`
  mutation CleanRoom($roomId: Int!) {
    cleanRoom(roomId: $roomId) {
      id
      cleaned
      cleanedAt
      cleanedBy
    }
  }
`;

const RoomCleanButton = ({ room }) => {
  return (
    <Mutation mutation={CLEAN_ROOM} variables={{ roomId: room.id }}>
      {(cleanRoom, { error, loading }) => {
        if (error) {
          message.error(error.message);
        }
        let tooltip = room.cleanedAt
          ? `Last cleaned ${room.cleanedAt} by ${room.cleanedBy}`
          : 'Never cleaned';

        if (room.isNotInDatabase) {
          tooltip =
            'Warning! This room is not in the database. Some functionality is limited';
        }

        return (
          <Tooltip placement="bottom" title={tooltip}>
            <Button
              disabled={room.isNotInDatabase}
              size="small"
              block
              type="danger"
              icon={room.cleaned ? 'frown' : 'smile'}
              loading={loading}
              onClick={cleanRoom}
            >
              {room.cleaned ? 'Mark Dirty' : 'Mark Clean'}
            </Button>
          </Tooltip>
        );
      }}
    </Mutation>
  );
};

export default RoomCleanButton;
