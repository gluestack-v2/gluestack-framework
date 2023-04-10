import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import generateRoutes from '../helpers/generate-routes';

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
		.command('route:generate')
		.description(
			'Generates nginx.conf file against the seal.yaml file'
		)
		.action(() => generateRoutes(app));
};
