/**
 * Installs the project or plugin
 */

import pluginList = require('../actions/plugin-list');
import IAppCLI from '../types/app/interface/IAppCLI';
import IProgram from '../types/app/interface/IProgram';

export default async (program: IProgram, app: IAppCLI) => {
	const command = program
		.command('plugin:list')
		.description('Prints the list of available plugins')
		.action(pluginList);
};
