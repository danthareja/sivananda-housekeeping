import React from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import App from './App/App';
import Login from './Login/Login';
import Auth from './Auth/Auth';

const history = createHistory();
const auth = new Auth(history);

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <PrivateRoute path="/" component={App} />
      </Switch>
    </Router>
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => <Component auth={auth} {...props} />} />
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated() ? (
          <Component auth={auth} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
