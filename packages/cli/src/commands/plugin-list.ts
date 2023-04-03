/**
 * Installs the project or plugin
 */

import AppCLI from '../helpers/lib/app';
import pluginList from '../actions/plugin-list';
import IProgram from '../types/app/interface/IProgram';

export default async (program: IProgram, app: AppCLI) => {
	const command = program
		.command('plugin:list')
		.description('Prints the list of available plugins')
		.action(pluginList);
};
