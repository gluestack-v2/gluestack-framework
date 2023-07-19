import path from 'path';
import { writeFile } from '@gluestack-v2/framework-cli/build/helpers/file/write-file';

export async function writeStorageServerSdk(
  _storageClientInstanceName: any,
  destinationPath: any
) {
  const sdkPath = destinationPath;

  await writeFile(
    path.join(sdkPath, 'src', 'index.ts'),
    `import ServiceProvider from '@gluestack-v2/framework-cli/build/plugin/ServiceProvider';
    import axios from 'axios';
    import type { Client } from '@types/minio';
    import Minio from 'minio';
    
    export default class SDK extends ServiceProvider {
      minioClient: any;
      constructor() {
        // Initialization code goes here
        super();
        console.log('ServerSDK instance initialized');
        // this.minioClient = new Minio.Client({
        //   endPoint: '127.0.0.1',
        //   port: 10310,
        //   useSSL: false,
        //   accessKey: 'gluestack',
        //   secretKey: 'password',
        // });
      }
      //static functions
      init(): void {
        //
      }
      destroy(): void {
        //
      }
      login() {}
    
      setStorageclient(minioClient: Client) {
        this.minioClient = minioClient;
      }
    
      // getStorageclient() {
      //   return this.minioClient;
      // }
    }
    `
  );
}
