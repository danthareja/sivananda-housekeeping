import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import RoomTable from './components/RoomTable';

const client = new ApolloClient({
  uri: '/graphql',
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
