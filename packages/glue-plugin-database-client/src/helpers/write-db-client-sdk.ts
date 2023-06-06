import path from 'path';
import { writeFile } from '@gluestack/helpers';
import fs from 'fs';

export async function writeDbClientSdk(
  functionSourcePath: any,
  destinationPath: any
) {
  const sdkPath = destinationPath;

  let sdkFileContent = fs
    .readFileSync(path.join(__dirname, '..', '..', 'sdk', 'src', 'index.ts'))
    .toString();

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

  sdkFileContent = sdkFileContent
    .replace('// **---Frontend SDK will be added before this---**', clientSdk)
    .replace('// **---Import will be added before this---**', clientSdkImports)
    .replace(
      '// **---Constructor will be added before this---**',
      'SDK.propChain = []'
    );

  // Create SDK index file with all the functions
  await writeFile(path.join(sdkPath, 'src', 'index.ts'), sdkFileContent);

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

  const dbTsPath = path.join(functionSourcePath, 'db.ts');
  await writeFile(dbTsPath, dbTs);
}
