/**
 * Watches the instances for changes and restarts them
 */

import action from "../actions/watch";

import App from "../helpers/lib/app";
import IProgram from "../types/app/interface/IProgram";


export default  async (program:IProgram, app:App) => {
	const command = program
		.command('watch')
		.description('Watches the instances for changes and restarts them')
		.action(() => action(app));
};
