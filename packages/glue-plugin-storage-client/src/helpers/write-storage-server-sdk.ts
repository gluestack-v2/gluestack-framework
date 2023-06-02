import path from 'path';
import { writeFile } from '@gluestack/helpers';
import fs from 'fs';

export async function writeStorageServerSdk(
  storageClientInstanceName: any,
  destinationPath: any
) {
  const sdkPath = destinationPath;
  const finalString = `
  setStorageclient(minioClient) {
    this.minioClient = minioClient;
  }

  getStorageclient() {
    return this.minioClient;
  }
`;

  // console.log(finalString, map);

  const sdkFileContent = fs
    .readFileSync(path.join(__dirname, '..', '..', 'sdk', 'src', 'index.ts'))
    .toString();

  await writeFile(
    path.join(sdkPath, 'src', 'index.ts'),
    sdkFileContent.replace(
      '// **---Functions will be added after this---**',
      finalString
    )
  );

  // await writeFile(
  //   sdkSrcIndex,
  //   sdKData.replace(
  //     "// **---Functions will be added after this---**",
  //     storageClientTemplate(storageClientInstanceName)
  //   )
  // );
}
