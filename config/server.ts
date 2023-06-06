import DBSDK from '@project/dbclient-server-sdk';
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
    DbServerSDK: DBSDK,
  },
};
