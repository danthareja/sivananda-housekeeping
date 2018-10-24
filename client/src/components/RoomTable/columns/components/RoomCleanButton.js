import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { message, Button } from 'antd';

const GET_ROOM = gql`
query GetRoom($id:Int!) {
  room(id:$id) {
    id
    cleaned
    cleanedAt
  }
}
`

const CLEAN_ROOM = gql`
mutation CleanRoom($id: Int!) {
  cleanRoom(id: $id){
    id
    cleaned
    cleanedAt
  }
}
`;

const RoomCleanButton = ({ id }) => {
  return (
    <Query query={GET_ROOM} variables={{ id }}>
      {({ loading, error, data }) => {
        if (error) {
          return <Button block disabled>Error</Button>
        }
        if (loading) {
          return <Button block loading/>
        }
        return (
          <Mutation mutation={CLEAN_ROOM} variables={{ id }}>
            {(cleanRoom, { error, loading }) => {
              if (error) {
                message.error(error.message)
              }
              return data.room.cleaned
                ? <Button block type="danger" icon="frown" loading={loading} onClick={cleanRoom}>Mark Dirty</Button>
                : <Button block type="primary" icon="smile" loading={loading} onClick={cleanRoom}>Mark Clean</Button>
            }}
          </Mutation>
        )
      }}
    </Query>
  );
}

export default RoomCleanButton;