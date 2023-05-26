class Auth {
  constructor() {
    this.login();
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
