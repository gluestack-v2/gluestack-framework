import path from "path";
import fs from "fs";
import { writeFile } from "@gluestack/helpers";
import writeSDKFunction from "./write-sdk-function";
import getFileNameWithoutExtension from "./get-file-name-without-ext";
import sdkIndexTemplateFunc from "./sdk-template";
function filePathExtension(filePath: string) {
  return filePath.split(".").pop() ?? "";
}
let functionsMap: any = {};

function getNestedFilePaths(dirPath: any, fileList: any = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If the file is a directory, recursively call the function
      // to get nested file paths
      getNestedFilePaths(filePath, fileList);
    } else {
      // If the file is a regular file, add its path to the fileList
      fileList.push(filePath);
    }
  });

  return fileList;
}

const createFunctionFromPath = (path: string, value: any, sdkFunction: any) => {
  const pathArr = path.split("/");
  // console.log(sdkFunction);
  let obj = {};
  let current: any = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (pathArr[i] !== "") {
      // if (i == pathArr.length - 1) {
      //   console.log(i, "in if");
      //   current[pathArr[i]] = sdkFunction;
      // } else {

      current[pathArr[i]] = {};
      // }
      current = current[pathArr[i]];
    }
  }
  current[pathArr[pathArr.length - 1]] = "****" + path + "****";
  functionsMap["****" + path + "****"] = sdkFunction;

  return obj;
};

const deepMerge = (obj1: any, obj2: any) => {
  let output = { ...obj1 };
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        typeof obj2[key] === "object" &&
        obj1.hasOwnProperty(key) &&
        typeof obj1[key] === "object"
      ) {
        output[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        output[key] = obj2[key];
      }
    }
  }
  return output;
};

function indexFileTemplate() {
  return `
/*** Add Imports Here ***/

export class SDK {
  constructor() {}
  /*** Add Functions Here ***/
}

`;
}

async function writeIndexFile(
  sdkSrcIndex: string,
  instanceName: string,
  storageClientExists: boolean
) {
  let templateString = indexFileTemplate();
  let imports = `import ${instanceName} from "./${instanceName}"`;
  // const sdkSrcIndexPath = path.join(sdkPath, `${instanceName}.ts`);
  if (storageClientExists) {
    imports = imports + "\n" + `import storageClient from "./storage"`;
  }

  templateString = templateString.replace(
    "/*** Add Imports Here ***/",
    imports
  );
  templateString = templateString.replace(
    "/*** Add Functions Here ***/",
    `${instanceName}=${instanceName}` + "\n" + "/*** Add Functions Here ***/"
  );
  if (storageClientExists) {
    templateString = templateString.replace(
      "/*** Add Functions Here ***/",
      `storage=storageClient` + "\n" + "/*** Add Functions Here ***/"
    );
  }

  await writeFile(sdkSrcIndex, templateString);
}

const writeSDK = async (
  sourcePath: string,
  installationPath: string,
  ignoredPaths: string[],
  instanceName: string,
  storageClientExists: boolean
) => {
  let obj = {};
  let sdkIndexTemplate = sdkIndexTemplateFunc(instanceName);
  let functionsPath = sourcePath;
  const sdkPath = installationPath;
  const sdkSrcIndex = path.join(sdkPath, `index.ts`);

  const files = getNestedFilePaths(functionsPath);

  let sdkFunctions = ``;
  let finalString = ``;
  writeIndexFile(sdkSrcIndex, instanceName, storageClientExists);

  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;

    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }

    if (functionFile.includes("server/")) {
      functionFile = functionFile.replace("server/", "");
    }
    for (let i = 0; i < ignoredPaths.length; i++) {
      if (filePath.includes("/" + ignoredPaths[i] + "/")) {
        return;
      }
    }

    const functionName = getFileNameWithoutExtension(filePath);

    let functionPath = filePath.replace(process.cwd(), "");
    functionPath = functionPath.split(".").slice(0, -1).join(".");

    const functionCodeString = fs.readFileSync(filePath, "utf8");

    const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
    const matches = functionCodeString.match(regex);
    let params: any = [];
    if (matches && matches[1]) {
      params = matches[1].split(/\s*,\s*/);
    } else {
      params = [];
      console.log(
        "NO MATCHES FOR PARMAS IN THE PROVIDED FUNCTION " + functionName
      );
    }
    // console.log(ign);

    let sdkFunction = writeSDKFunction(functionName, params, functionPath);

    obj = {
      ...obj,
      ...deepMerge(
        obj,
        createFunctionFromPath(
          // HACK: Removing server and function instance name
          functionPath.replace("server/" + instanceName + "/", ""),
          {},
          sdkFunction
        )
      ),
    };

    finalString = JSON.stringify(obj);
    finalString = finalString.substring(1, finalString.length - 1);

    Object.keys(functionsMap).map((key: any) => {
      finalString = finalString.replace(`"${key}"`, functionsMap[key]);
    });

    sdkFunctions += sdkFunction + "\n";
  });

  sdkIndexTemplate = sdkIndexTemplate.replace(
    "// **---Functions will be added after this---**",
    finalString
  );

  if (storageClientExists) {
    await writeFile(
      path.join(sdkPath, `${instanceName}.ts`),
      sdkIndexTemplate.replace(
        "// **---Functions will be added after this---**",
        finalString
      )
    );
  }

  // Create SDK index file with all the functions
  await writeFile(sdkSrcIndex, sdkIndexTemplate);
};

const writeClientSDK = async (
  sourcePath: string,
  installationPath: string,
  ignoredPaths: string[],
  instanceName: string
) => {
  let obj = {};
  let sdkIndexTemplate = sdkIndexTemplateFunc(instanceName);
  const functionsPath = sourcePath;
  const sdkPath = installationPath;
  const sdkSrcIndex = path.join(sdkPath, "index.ts");

  const files = getNestedFilePaths(functionsPath);

  let sdkFunctions = ``;
  let finalString = ``;
  files.forEach((functionFile: string, _index: number) => {
    const filePath = functionFile;

    if (
      ["json"].includes(filePathExtension(filePath)) ||
      filePath.includes("node_modules")
    ) {
      return;
    }

    for (let i = 0; i < ignoredPaths.length; i++) {
      if (filePath.includes("/" + ignoredPaths[i] + "/")) {
        return;
      }
    }

    const functionName = getFileNameWithoutExtension(filePath);

    let functionPath = filePath.replace(process.cwd(), "");
    functionPath = functionPath.split(".").slice(0, -1).join(".");

    const functionCodeString = fs.readFileSync(filePath, "utf8");

    const regex = /const\s*\{\s*([^}]+)\s*\}\s*=\s*ctx.params\s*;/;
    const matches = functionCodeString.match(regex);
    let params: any = [];
    if (matches && matches[1]) {
      params = matches[1].split(/\s*,\s*/);
    } else {
      params = [];
      console.log(
        "NO MATCHES FOR PARMAS IN THE PROVIDED FUNCTION " + functionName
      );
    }
    // console.log(ign);
    let sdkFunction = writeSDKFunction(functionName, params, functionPath);
    obj = {
      ...obj,
      ...deepMerge(obj, createFunctionFromPath(functionPath, {}, sdkFunction)),
    };

    finalString = JSON.stringify(obj).replace(":", "=");
    finalString = finalString.substring(1, finalString.length - 1);

    Object.keys(functionsMap).map((key: any) => {
      finalString = finalString.replace(`"${key}"`, functionsMap[key]);
    });

    sdkFunctions += sdkFunction + "\n";
  });

  let clientSdk = `
    static propChain: string[];
    get prisma() {
      return this.helper();
    }
    helper = function () {
      const prismaFunctions = [
        "findUnique",
        "findUniqueOrThrow",
        "findFirst",
        "findFirstOrThrow",
        "findMany",
        "create",
        "update",
        "delete",
        "upsert",
        "createMany",
        "updateMany",
        "deleteMany",
        "aggregate",
        "count",
        "groupBy",
      ];
      var obj: PrismaClient = {};
      obj = new Proxy(obj, {
        get: function (target, prop) {
          if (prismaFunctions.includes(prop)) {
            return (params: any) => {
              SDK.propChain.push({
                type: "function",
                key: prop,
                args: params,
              });
              return new Promise(async (resolve: any, reject: any) => {
                // Your async function code here
                try {
                  const response = await axios({
                    method: "post",
                    url: "http://localhost:3003/api/functions/functions/db",
                    data: { query: SDK.propChain },
                  });
                  resolve(response.data);
                } catch (error: any) {
                  reject(error.message);
                }
              });
            };
          }
          if (typeof prop === "string") {
            SDK.propChain.push({ type: "key", key: prop });
          }
          return obj;
        },
      });
  
      return obj;
    };
  `;

  let clientSdkImports = `
  import type { PrismaClient } from "@prisma/client";
`;

  sdkIndexTemplate = sdkIndexTemplate
    .replace("// **---Frontend SDK will be added before this---**", clientSdk)
    .replace("// **---Import will be added before this---**", clientSdkImports)
    .replace(
      "// **---Constructor will be added before this---**",
      "SDK.propChain = []"
    );
  sdkIndexTemplate = sdkIndexTemplate.replace(
    "// **---Functions will be added after this---**",
    finalString
  );

  // Create SDK index file with all the functions
  await writeFile(sdkSrcIndex, sdkIndexTemplate);

  // create db.ts file in functions instance folder
  const dbTs = `
  module.exports = async function handler(ctx) {
    const { query } = ctx.params;
    const { prismaClient } = ctx.sdk;
    let resolvedQuery = prismaClient;
    query.forEach(async (q) => {
      if (q.type === "key") {
        resolvedQuery = resolvedQuery?.[q.key];
      }
      if (q.type === "function") {
        arguments = q.args || {};
        resolvedQuery = await resolvedQuery?.[q.key](arguments);
      }
    });
    return resolvedQuery;
  };
  `;

  const dbTsPath = path.join(sourcePath, "db.ts");
  await writeFile(dbTsPath, dbTs);
};

export { writeSDK, writeClientSDK };
