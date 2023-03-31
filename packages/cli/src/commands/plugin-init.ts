/**
 * Installs the project or plugin
 */

import pluginInit from '../actions/plugin-init';

import App from '../helpers/lib/app';
import IProgram from '../types/app/interface/IProgram';

export default async (program: IProgram, app: App) => {
	const command = program
		.command('plugin:init')
		.description('Initializes the gluestack app as a plugin');

	command
		.command('instance')
		.description('Initializes the gluestack app as a plugin instance')
		.action(() => pluginInit(app, 'instance'));

	command
		.command('container')
		.description(
			'Initializes the gluestack app as a container plugin'
		)
		.action(() => pluginInit(app, 'container'));
};
