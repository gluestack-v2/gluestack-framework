/**
 * Installs the project or plugin
 */

import pluginList from '../actions/plugin-list';

import App from '../helpers/lib/app';
import IProgram from '../types/app/interface/IProgram';

export default async (program: IProgram, app: App) => {
	const command = program
		.command('plugin:list')
		.description('Prints the list of available plugins')
		.action(pluginList);
};
