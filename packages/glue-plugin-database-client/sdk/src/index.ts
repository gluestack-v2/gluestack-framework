import ServiceProvider from '@gluestack-v2/framework-cli/build/types/ServiceProvider';
// import axios from 'axios';

export default class SDK extends ServiceProvider {
  constructor() {
    // Initialization code goes here
    // @ts-ignore
    super();
    // eslint-disable-next-line no-console
    console.log('ServerSDK instance initialized');
  }
  //static functions
  init(): void {
    //
  }
  destroy(): void {
    //
  }
  login() {}
  // **---Functions will be added after this---**
}
