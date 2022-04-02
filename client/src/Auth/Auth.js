import jwtDecode from 'jwt-decode';

export default class Auth {
  constructor(history) {
    this.history = history;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  async login({ username, password }) {
    const server = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    try {
      const response = await fetch(`${server}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const token = await response.text();
      if (token === 'error in login') throw new Error();
      localStorage.setItem('jwt', token);

      // navigate to the app route
      this.history.replace('/dashboard');
    } catch {
      console.error('error in login');
    }
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('jwt');
    // navigate to the login route
    this.history.replace('/login');
  }

  isAuthenticated() {
    if (!localStorage.getItem('jwt')) return false;
    let expiresAt = new Date(jwtDecode(localStorage.getItem('jwt')).exp * 1000);

    return new Date() < expiresAt;
  }

  getUser() {
    return jwtDecode(localStorage.getItem('jwt'));
  }
}
