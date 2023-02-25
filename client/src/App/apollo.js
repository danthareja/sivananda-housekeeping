import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri:
    (process.env.REACT_APP_SERVER_URL || 'http://localhost:4000') + '/graphql',
  request: async operation => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
  },
});
