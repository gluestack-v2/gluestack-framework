import deploy from '@gluestack-seal/cli/build/actions/deploy';
import { BOLT_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/gluestack.v2';

export default async (options: any): Promise<void> => {
  // process.chdir('./.glue/__generated__/bolt/services');
  process.chdir(BOLT_SERVICES_PATH);
  deploy(options);
};
