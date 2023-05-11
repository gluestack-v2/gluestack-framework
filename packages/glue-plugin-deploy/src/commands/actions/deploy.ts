const path = require('path');
const os = require('os');
const fs = require('fs');

import deploy from '@gluestack-seal/cli/build/actions/deploy';
import { SEAL_SERVICES_PATH } from '@gluestack-v2/framework-cli/build/constants/seal';

export default async (options: any): Promise<void> => {
    // process.chdir('./.glue/__generated__/seal/services');
    process.chdir(SEAL_SERVICES_PATH);
    deploy(options);
};
