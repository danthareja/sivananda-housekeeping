import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { message, Button } from 'antd';

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

const RoomCleanButton = ({ roomId, guest }) => {
  return (
    <Mutation
      mutation={GIVE_ROOM_KEY}
      variables={{ roomId, guestId: guest.id }}
    >
      {(giveRoomKey, { error, loading }) => {
        if (error) {
          message.error(error.message);
        }
        return guest.givenRoomKey ? (
          <Button
            size="small"
            type="danger"
            icon="key"
            loading={loading}
            onClick={giveRoomKey}
          >
            Take Key
          </Button>
        ) : (
          <Button
            size="small"
            icon="key"
            loading={loading}
            onClick={giveRoomKey}
          >
            Give Key
          </Button>
        );
      }}
    </Mutation>
  );
};

export default RoomCleanButton;
