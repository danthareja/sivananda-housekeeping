import React, { Component } from 'react';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

import RoomListContainer from './components/RoomListContainer.js'

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <RoomListContainer />
      </ApolloProvider>
    );
  }
}

export default App;
