import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import ServiceProvider from '@gluestack-v2/framework-cli/build/types/ServiceProvider';
import type { PrismaClient } from '@prisma/client';

export default class SDK extends ServiceProvider {
  prisma: any;
  constructor(app: AppCLI) {
    super(app);

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

  setDbClient(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
