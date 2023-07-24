import ServiceProvider from '@gluestack-v2/framework-cli/build/plugin/ServiceProvider';
import type { PrismaClient } from '@prisma/client';

export default class SDK extends ServiceProvider {
  prisma: any;
  constructor() {
    super();

    // eslint-disable-next-line no-console
    console.log('DbClient ServerSDK instance initialized');
  }
  //static functions
  init(): void {
    //
  }
  destroy(): void {
    //
  }

  getProvider() {
    return this.prisma;
  }

  setDbClient(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
