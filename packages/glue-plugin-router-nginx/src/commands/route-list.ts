import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import listRoutes from '../helpers/list-routes';

export default async (program: any, app: AppCLI): Promise<void> => {
  const command: ICommand = program
		.command('route:list')
		.description(
			'Lists routes from the seal.yaml file'
		)
		.action(() => listRoutes(app));
};
