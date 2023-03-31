/**
 * Installs the project or plugin
 */

import installedPluginList from "../actions/installed-plugin-list";
import AppCLI from "../helpers/lib/app";
import IProgram from "../types/app/interface/IProgram";

export default async (program: IProgram, app: AppCLI) => {
	const command = program
		.command('instance:list')
		.description('Prints the list of installed plugin instances')
		.action(() => {
			installedPluginList(app);
		});
};
