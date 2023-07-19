import ServiceProvider from '@gluestack-v2/framework-cli/build/plugin/ServiceProvider';
import axios from 'axios';
import type { PrismaClient } from '@prisma/client';
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

  static propChain: string[];
  get prisma() {
    return this.helper();
  }
  helper = function () {
    const prismaFunctions = [
      'findUnique',
      'findUniqueOrThrow',
      'findFirst',
      'findFirstOrThrow',
      'findMany',
      'create',
      'update',
      'delete',
      'upsert',
      'createMany',
      'updateMany',
      'deleteMany',
      'aggregate',
      'count',
      'groupBy',
    ];
    var obj: PrismaClient = {};
    obj = new Proxy(obj, {
      get: function (target, prop) {
        if (prismaFunctions.includes(prop)) {
          return (params: any) => {
            SDK.propChain.push({
              type: 'function',
              key: prop,
              args: params,
            });
            return new Promise(async (resolve: any, reject: any) => {
              // Your async function code here
              try {
                const response = await axios({
                  method: 'post',
                  url: 'http://localhost:3003/api/dbClient/db',
                  data: { query: SDK.propChain },
                });
                //TODO: review-rohit
                SDK.propChain = [];
                resolve(response.data);
              } catch (error: any) {
                //TODO: review-rohit
                SDK.propChain = [];
                reject(error.message);
              }
            });
          };
        }
        if (typeof prop === 'string') {
          SDK.propChain.push({ type: 'key', key: prop });
        }
        return obj;
      },
    });

    return obj;
  };
}
