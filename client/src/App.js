import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import RoomTable from './components/RoomTable';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RoomTable />
      </ApolloProvider>
    );
  }
}

export default App;
