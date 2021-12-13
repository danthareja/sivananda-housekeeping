import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Route, Link, Redirect } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import client from './apollo';
import RoomTable from './components/RoomTable';

const App = ({ auth, match, location, history }) => {
  if (location.pathname !== '/dashboard') {
    return <Redirect to="/dashboard" />;
  }
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Layout className="layout">
          <Layout.Header style={{ padding: '0px 10px' }}>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item
                onClick={auth.logout}
                key="2"
                style={{ float: 'right' }}
              >
                Log Out
              </Menu.Item>
            </Menu>
          </Layout.Header>
          <Layout.Content style={{ padding: '10px 10px' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
              <Route path="/dashboard" component={RoomTable} />
            </div>
          </Layout.Content>
          <Layout.Footer style={{ textAlign: 'center' }}>
            Sivananda Bahamas ©2021
          </Layout.Footer>
        </Layout>
      </div>
    </ApolloProvider>
  );
};

export default App;
