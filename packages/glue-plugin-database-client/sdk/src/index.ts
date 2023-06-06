import ServiceProvider from '@gluestack-v2/framework-cli/build/types/ServiceProvider';
import axios from 'axios';
// **---Import will be added before this---**

export default class SDK extends ServiceProvider {
  constructor() {
    // Initialization code goes here
    // @ts-ignore
    super();
    // eslint-disable-next-line no-console
    console.log('ServerSDK instance initialized');
    // **---Constructor will be added before this---**
  }
  //static functions
  init(): void {
    //
  }
  destroy(): void {
    //
  }
  login() {}
  // **---Frontend SDK will be added before this---**
}
