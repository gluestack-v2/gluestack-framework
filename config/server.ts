class Test {
  login() {
    console.log('login');
  }
  constructor() {
    this.login();
  }
}

export const config = {
  providers: {
    test: Test,
  },
};
