import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import * as fs from 'fs';
import { join } from 'path';

export async function writeEnv(minioInstance: IInstance) {
  // const plugin=
  // FIX: Don't get installation path from plugin instance

  let env = '';
  // @ts-ignore
  const keys: any = await minioInstance.getEnv();
  Object.keys(keys).forEach((key) => {
    env += `${key}=${keys[key]}
`;
  });

  // Write the .env file at database root
  fs.writeFileSync(join(minioInstance._sourcePath, '.env'), env);
}
