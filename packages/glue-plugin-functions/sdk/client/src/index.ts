import ServiceProvider from '@gluestack-v2/framework-cli/build/plugin/ServiceProvider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';

export default class SDK extends ServiceProvider {
  //static functions
  init(): void {
    //
  }
  destroy(): void {
    //
  }
  login() {}

  getProvider(): SDK {
    return this;
  }
  // **---Functions will be added after this---**
}
