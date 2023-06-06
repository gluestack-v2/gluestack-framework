import path from 'path';
import { writeFile } from '@gluestack/helpers';
// import fs from 'fs';

export async function writeDbServerSdk(sdkPath: any) {
  //   const finalString = `
  //   setStorageclient(minioClient) {
  //     this.minioClient = minioClient;
  //   }

  //   getStorageclient() {
  //     return this.minioClient;
  //   }
  // `;
  // console.log(finalString, map);

  // const sdkFileContent = fs
  //   .readFileSync(path.join(__dirname, '..', '..', 'sdk', 'src', 'index.ts'))
  //   .toString();

  // await writeFile(
  //   path.join(sdkPath, 'src', 'index.ts'),
  //   sdkFileContent.replace(
  //     '// **---Functions will be added after this---**',
  //     finalString
  //   )
  // );
  await writeFile(
    path.join(sdkPath, 'src', 'index.ts'),
    `import ServiceProvider from '@gluestack-v2/framework-cli/build/types/ServiceProvider';
    import type {PrismaClient} from '@prisma/client';
    
    export default class SDK extends ServiceProvider {
      prisma: any;
      constructor() {
        super();
        console.log('DbClient ServerSDK instance initialized');
      }
      //static functions
      init(): void {
        //
      }
      destroy(): void {
        //
      }
    
      setDbClient(prisma: PrismaClient) {
        this.prisma = prisma;
      }
    }
    `
  );

  // await writeFile(
  //   sdkSrcIndex,
  //   sdKData.replace(
  //     "// **---Functions will be added after this---**",
  //     storageClientTemplate(storageClientInstanceName)
  //   )
  // );
}
