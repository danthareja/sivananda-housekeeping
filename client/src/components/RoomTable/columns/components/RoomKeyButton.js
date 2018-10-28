import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { message, Button } from 'antd';

const GIVE_ROOM_KEY = gql`
  mutation GiveRoomKey($id: Int!) {
    giveRoomKey(id: $id) {
      id
      givenKey
      givenKeyAt
    }
  }
`;

const RoomCleanButton = ({ room }) => {
  return (
    <Mutation mutation={GIVE_ROOM_KEY} variables={{ id: room.id }}>
      {(giveRoomKey, { error, loading }) => {
        if (error) {
          message.error(error.message);
        }
        return room.givenKey ? (
          <Button
            block
            type="danger"
            icon="key"
            loading={loading}
            onClick={giveRoomKey}
          >
            Take Keys
          </Button>
        ) : (
          <Button block icon="key" loading={loading} onClick={giveRoomKey}>
            Give Keys
          </Button>
        );
      }}
    </Mutation>
  );
};

export default RoomCleanButton;
