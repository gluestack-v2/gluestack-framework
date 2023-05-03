/**
 * Watches the instances for changes and restarts them
 */

import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/construct';

export default async (program: ICommand, app: AppCLI) => {
	program
		.command('ai:construct')
		.description(
			'Constructs the OpenAI LLM Dictionary from the training data within markdown files'
		)
		.action(() => action(app));
};
