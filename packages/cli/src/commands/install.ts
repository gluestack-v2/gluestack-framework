/**
 * Installs the project or plugin
 */

import  {Argument} from "commander";
import install from "../actions/install";
import IAppCLI from "../types/app/interface/IAppCLI";
import IProgram from "../types/app/interface/IProgram";


export default  async (program:IProgram, app:IAppCLI) => {
	// install group command
	const command = program
		.command('add')
		.alias('install')
		.description(
			'installs a gluestack plugin, use help for more info on subcommands'
		)
		.addArgument(
			new Argument(
				'<plugin-name>',
				'name of the plugin from gluestack group'
			)
		)
		.addArgument(
			new Argument(
				'<instance-name>',
				'name of the instance to install the plugin'
			)
		)
		.action(async (pluginName:string, instanceName:string) => {
			await install(app, pluginName, instanceName);
		});
};
