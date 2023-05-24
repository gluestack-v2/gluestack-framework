import path from "path";
import fs from "fs";
import { writeFile } from "@gluestack/helpers";

const minioMap = [
  "makeBucket",
  "getObject",
  "presignedUrl",
  "getBucketNotification",
  "setS3TransferAccelerate",
  "listBuckets",
  "getPartialObject",
  "presignedGetObject",
  "setBucketNotification",
  "bucketExists",
  "fGetObject",
  "presignedPutObject",
  "removeAllBucketNotification",
  "removeBucket",
  "putObject",
  "presignedPostPolicy",
  "getBucketPolicy",
  "listObjects",
  "fPutObject",
  "setBucketPolicy",
  "listObjectsV2",
  "copyObject",
  "listenBucketNotification",
  "listIncompleteUploads",
  "statObject",
  "getBucketVersioning",
  "removeObject",
  "setBucketVersioning",
  "removeObjects",
  "getBucketTagging",
  "removeIncompleteUpload",
  "setBucketTagging",
  "putObjectRetention",
  "removeBucketTagging",
  "getObjectRetention",
  "setBucketLifecycle",
  "putObjectTagging",
  "getBucketLifecycle",
  "removeObjectTagging",
  "removeBucketLifecycle",
  "getObjectTagging",
  "setObjectLockConfig",
  "getObjectLegalHold",
  "getObjectLockConfig",
  "setObjectLegalHold",
  "getBucketEncryption",
  "composeObject",
  "setBucketEncryption",
  "selectObjectContent",
  "removeBucketEncryption",
  "setBucketReplication",
  "getBucketReplication",
  "removeBucketReplication",
];
const map: any = {};

const operationTemplate = (operationName: string) => {
  return `
  (params:any) => {
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
        reject(error.message);
      }
    });
  }`;
};

function createObjectFromMap() {
  let obj: any = {};
  minioMap.map((key) => {
    obj[key] = "/*** " + key + " ***/";
    const value = operationTemplate(key);
    map["/*** " + key + " ***/"] = value;
  });
  return obj;
}

export async function writeStorageClient(
  storageClientInstanceName: any,
  destinationPath: any
) {
  const sdkPath = destinationPath;
  let finalString = JSON.stringify(createObjectFromMap());
  // console.log(finalString, map);
  Object.keys(map).map((key) => {
    finalString = finalString.replace(`"${key}"`, map[key]);
  });

  await writeFile(
    path.join(sdkPath, `storage.ts`),
    storageClientTemplate(storageClientInstanceName).replace(
      " /*** Add Minio map here ***/",
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

const storageClientTemplate = (storageClientInstanceName: string) => {
  return `
  import axios from "axios";

  const storageClient =  
    /*** Add Minio map here ***/

  export default storageClient;

  `;
};
