import cookie from './cookies'

class Auth {
  constructor() {
    this.authenticated = !!sessionStorage.getItem('userId') ||
                         !!cookie.getCookie('userId');
  }

  login(callback) {
    this.authenticated = true;
    callback();
  }

  logout(callback) {
    this.authenticated = false;
    callback();
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();