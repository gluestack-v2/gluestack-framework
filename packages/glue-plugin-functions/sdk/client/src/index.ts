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
  upload = (data: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      // Your async function code here
      try {
        const response = await axios({
          method: 'post',
          url: 'http://localhost:3003/api/upload',
          data: { data },
        });

        resolve(response.data);
      } catch (error: any) {
        reject(error.message);
      }
    });
  };
  // **---Functions will be added after this---**
}
