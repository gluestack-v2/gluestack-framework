import ServiceProvider from '@gluestack-v2/framework-cli/build/plugin/ServiceProvider';
import axios from 'axios';
import type { PrismaClient } from '@prisma/client';

// **---Import will be added before this---**

export default class SDK extends ServiceProvider {
  propChain: any[] = [];

  constructor() {
    // Initialization code goes here
    super();
    // eslint-disable-next-line no-console
    console.log('ServerSDK instance initialized');
    // return this.prisma;
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

  get prisma() {
    return this.helper();
  }
  getInstance(): any {
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
      get: (target, prop: any) => {
        console.log('prop>>>>>.', prop);
        if (prismaFunctions.includes(prop)) {
          return (params: any) => {
            console.log('pushinggg', this.propChain);
            this.propChain.push({
              type: 'function',
              key: prop,
              args: params,
            });
            return new Promise(async (resolve: any, reject: any) => {
              // Your async function code here
              console.log(this.propChain);
              try {
                const response = await axios({
                  method: 'post',
                  url: 'http://localhost:3003/api/dbClient/db',
                  data: { query: this.propChain },
                });
                //TODO: review-rohit
                this.propChain = [];
                resolve(response.data);
              } catch (error: any) {
                //TODO: review-rohit
                this.propChain = [];
                reject(error.message);
              }
            });
          };
        }
        if (typeof prop === 'string') {
          this.propChain.push({ type: 'key', key: prop });
        }
        return obj;
      },
    });

    return obj;
  };
}
