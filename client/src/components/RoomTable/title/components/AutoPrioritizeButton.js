import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { message, Button } from 'antd';

const AUTO_PRIORITIZE_ROOMS = gql`
  mutation AutoPrioritizeRooms {
    automaticallyPrioritizeRooms {
      id
      priority
    }
  }
`;

const AutoPrioritizeButton = () => {
  return (
    <Mutation mutation={AUTO_PRIORITIZE_ROOMS}>
      {(autoPrioritizeRooms, { error, loading }) => {
        if (error) {
          message.error(error.message);
        }
        return (
          <Button
            size="large"
            type="primary"
            loading={loading}
            onClick={autoPrioritizeRooms}
          >
            Auto Prioritize
          </Button>
        );
      }}
    </Mutation>
  );
};

export default AutoPrioritizeButton;
