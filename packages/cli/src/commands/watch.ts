/**
 * Watches the instances for changes and restarts them
 */

import action from "../actions/watch";
import IAppCLI from "../types/app/interface/IAppCLI";
import IProgram from "../types/app/interface/IProgram";


export default  async (program:IProgram, app:IAppCLI) => {
	const command = program
		.command('watch')
		.description('Watches the instances for changes and restarts them')
		.action(() => action(app));
};
