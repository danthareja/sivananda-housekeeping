import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { message, Button } from 'antd';

const CLEAN_ROOM = gql`
  mutation CleanRoom($id: Int!) {
    cleanRoom(id: $id) {
      id
      cleaned
      cleanedAt
    }
  }
`;

const RoomCleanButton = ({ room }) => {
  return (
    <Mutation mutation={CLEAN_ROOM} variables={{ id: room.id }}>
      {(cleanRoom, { error, loading }) => {
        if (error) {
          message.error(error.message);
        }
        return room.cleaned ? (
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
        );
      }}
    </Mutation>
  );
};

export default RoomCleanButton;
