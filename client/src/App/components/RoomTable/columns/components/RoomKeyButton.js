import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { message, Button, Tooltip } from 'antd';

const GIVE_ROOM_KEY = gql`
  mutation GiveRoomKey($roomId: Int!, $guestId: Int!) {
    giveRoomKey(roomId: $roomId, guestId: $guestId) {
      id
      arrivingGuests {
        id
        givenRoomKey
        givenRoomKeyAt
        givenRoomKeyBy
      }
    }
  }
`;

const RoomKeyButton = ({ room, guest }) => {
  return (
    <Mutation
      mutation={GIVE_ROOM_KEY}
      variables={{ roomId: room.id, guestId: guest.id }}
    >
      {(giveRoomKey, { error, loading }) => {
        if (error) {
          message.error(error.message);
        }

        let tooltip = guest.givenRoomKeyAt
          ? `Last given ${guest.givenRoomKeyAt} by ${guest.givenRoomKeyBy}`
          : 'Never given key';

        if (room.isNotInDatabase) {
          tooltip =
            'Warning! This room is not in the database. Some functionality is limited';
        }

        return (
          <Tooltip placement="bottom" title={tooltip}>
            <Button
              disabled={room.isNotInDatabase}
              size="small"
              type={guest.givenRoomKey ? 'danger' : 'default'}
              icon="key"
              loading={loading}
              onClick={giveRoomKey}
            >
              {guest.givenRoomKey ? 'Take Key' : 'Give Key'}
            </Button>
          </Tooltip>
        );
      }}
    </Mutation>
  );
};

export default RoomKeyButton;
