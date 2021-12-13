import React, { Component } from 'react';

class Login extends Component {
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {isAuthenticated() && <h4>You are logged in!</h4>}
        {!isAuthenticated() && (
          <h2 style={{ marginTop: '2rem', textAlign: 'center' }}>
            You are not logged in! <br /> Please{' '}
            <a
              href="#"
              style={{ cursor: 'pointer' }}
              onClick={this.login.bind(this)}
            >
              Log In
            </a>{' '}
            to continue.
          </h2>
        )}
      </div>
    );
  }
}

export default Login;
