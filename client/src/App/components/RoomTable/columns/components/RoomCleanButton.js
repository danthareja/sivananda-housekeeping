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
        return (
          <Tooltip
            placement="bottom"
            title={
              room.cleanedAt
                ? `Last cleaned ${room.cleanedAt} by ${room.cleanedBy}`
                : 'Never cleaned'
            }
          >
            {room.cleaned ? (
              <Button
                block
                type="danger"
                icon="frown"
                loading={loading}
                onClick={cleanRoom}
              >
                Mark Dirty
              </Button>
            ) : (
              <Button block icon="smile" loading={loading} onClick={cleanRoom}>
                Mark Clean
              </Button>
            )}
          </Tooltip>
        );
      }}
    </Mutation>
  );
};

export default RoomCleanButton;
