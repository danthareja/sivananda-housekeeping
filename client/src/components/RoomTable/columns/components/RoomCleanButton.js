import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { message, Button } from 'antd';

const GET_ROOM = gql`
query GetRoom($id:Int!) {
  room(id:$id) {
    id
    dirty
    cleanedAt
  }
}
`

const CLEAN_ROOM = gql`
mutation CleanRoom($id: Int!) {
  cleanRoom(id: $id){
    id
    dirty
    cleanedAt
  }
}
`;

const RoomCleanButton = ({ id }) => {
  return (
    <Query query={GET_ROOM} variables={{ id }}>
      {({ loading, error, data }) => {
        if (error) {
          return <Button disabled={true}>Error</Button>
        }
        if (loading) {
          return <Button loading={true} />
        }
        return (
          <Mutation mutation={CLEAN_ROOM} variables={{ id }}>
            {(updateRoom, { error, loading }) => {
              if (error) {
                message.error(error.message)
              }
              return data.room.dirty
                ? <Button type="primary" icon="smile" loading={loading} onClick={updateRoom}>Mark Clean</Button>
                : <Button type="danger" icon="frown" loading={loading} onClick={updateRoom}>Mark Dirty</Button>  
            }}
          </Mutation>
        )
      }}
    </Query>
  );
}

export default RoomCleanButton;