import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { ICommand } from '@gluestack-v2/framework-cli/build/types/helpers/interface/ICommandCallback';

import action from './actions/run';

export default async (program: ICommand, app: AppCLI): Promise<void> => {
  program
		.command('ai')
		.argument('<prompt>', 'your prompt question for the OpenAI')
		.description(
			'Runs the prompt through the OpenAI API and returns the results'
		)
		.action((prompt: string) => action(app, prompt));
};
