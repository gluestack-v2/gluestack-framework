import ServiceProvider from '@gluestack-v2/framework-cli/build/plugin/ServiceProvider';
import axios from 'axios';

export default class SDK extends ServiceProvider {
  constructor() {
    // Initialization code goes here
    super();
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
