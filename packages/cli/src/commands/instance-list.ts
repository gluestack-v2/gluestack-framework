/**
 * Installs the project or plugin
 */

import installedPluginList from "../actions/installed-plugin-list";
import IAppCLI from "../types/app/interface/IAppCLI";
import IProgram from "../types/app/interface/IProgram";

export default async (program:IProgram, app:IAppCLI) => {
	const command = program
		.command('instance:list')
		.description('Prints the list of installed plugin instances')
		.action(() => {
			installedPluginList(app);
		});
};
