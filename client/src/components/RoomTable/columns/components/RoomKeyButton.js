import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { message, Button } from 'antd';

const GET_ROOM = gql`
query GetRoom($id:Int!) {
  room(id:$id) {
    id
    givenKey
  }
}
`

const GIVE_ROOM_KEY = gql`
mutation GiveRoomKey($id: Int!) {
  giveRoomKey(id: $id){
    id
    givenKey
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
          <Mutation mutation={GIVE_ROOM_KEY} variables={{ id }}>
            {(giveRoomKey, { error, loading }) => {
              if (error) {
                message.error(error.message)
              }
              return data.room.givenKey
                ? <Button type="danger" icon="key" loading={loading} onClick={giveRoomKey}>Take Keys</Button>  
                : <Button type="primary" icon="key" loading={loading} onClick={giveRoomKey}>Give Keys</Button>
            }}
          </Mutation>
        )
      }}
    </Query>
  );
}

export default RoomCleanButton;