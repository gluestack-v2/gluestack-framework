class Auth {
  constructor() {
    this.login();
  }
  init() {
    console.log('Auth init');
  }
  login() {
    console.log('login');
  }
}
export const config = {
  providers: {
    auth: Auth,
  },
};
