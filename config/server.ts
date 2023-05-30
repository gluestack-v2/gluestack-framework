class Test {
  login() {
    console.log('login');
  }
  constructor() {
    this.login();
  }
  init() {
    console.log('Test init');
  }
}

export const config = {
  providers: {
    test: Test,
  },
};
