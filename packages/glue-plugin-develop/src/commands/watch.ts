/**
 * Watches the instances for changes and restarts them
 */

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/watch';

export default async (program: ICommand, app: AppCLI) => {
	const command: ICommand = program
		.command('watch')
		.description(
			'Watches the instances for changes and restarts them'
		)
		.action(() => action(app));
};
