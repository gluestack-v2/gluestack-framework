/**
 * Runs build API for all the plugins
 */

import action from '../actions/build';
import AppCLI from '../helpers/lib/app';
import IProgram from '../types/app/interface/IProgram';

export default async (program: IProgram, app: AppCLI) => {
	const command = program
		.command('build')
		.description(
			'Runs build API for all the plugins'
		)
		.action(() => action(app));
};
