import path from 'path';
import { writeFile } from '@gluestack-v2/framework-cli/build/helpers/file/write-file';
import fs from 'fs';

const minioMap = [
  'makeBucket',
  'getObject',
  'presignedUrl',
  'getBucketNotification',
  'setS3TransferAccelerate',
  'listBuckets',
  'getPartialObject',
  'presignedGetObject',
  'setBucketNotification',
  'bucketExists',
  'fGetObject',
  'presignedPutObject',
  'removeAllBucketNotification',
  'removeBucket',
  'putObject',
  'presignedPostPolicy',
  'getBucketPolicy',
  'listObjects',
  'fPutObject',
  'setBucketPolicy',
  'listObjectsV2',
  'copyObject',
  'listenBucketNotification',
  'listIncompleteUploads',
  'statObject',
  'getBucketVersioning',
  'removeObject',
  'setBucketVersioning',
  'removeObjects',
  'getBucketTagging',
  'removeIncompleteUpload',
  'setBucketTagging',
  'putObjectRetention',
  'removeBucketTagging',
  'getObjectRetention',
  'setBucketLifecycle',
  'putObjectTagging',
  'getBucketLifecycle',
  'removeObjectTagging',
  'removeBucketLifecycle',
  'getObjectTagging',
  'setObjectLockConfig',
  'getObjectLegalHold',
  'getObjectLockConfig',
  'setObjectLegalHold',
  'getBucketEncryption',
  'composeObject',
  'setBucketEncryption',
  'selectObjectContent',
  'removeBucketEncryption',
  'setBucketReplication',
  'getBucketReplication',
  'removeBucketReplication',
];

const operationTemplate = (operationName: string, _instanceName: string) => {
  return `
  ${operationName} (params:any)  {
    return new Promise(async (resolve: any, reject: any) => {
      // Your async function code here
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:3003/api/storage/client",
          data: {
            operation: "${operationName}",
            params
          },
        });

        console.log(response.data);
        resolve(response.data);
      } catch (error: any) {
      }
    });
  }`;
};

function createObjectFromMap(instanceName: string) {
  let finalString: string = ``;

  minioMap.map((key) => {
    // obj[key] = '/*** ' + key + ' ***/';
    finalString = finalString + operationTemplate(key, instanceName);
    // map['/*** ' + key + ' ***/'] = value;
  });
  return finalString;
}

export async function writeStorageClient(
  storageClientInstanceName: any,
  destinationPath: any
) {
  const sdkPath = destinationPath;
  const finalString = createObjectFromMap(storageClientInstanceName);

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
}
