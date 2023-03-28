/**
 * Watches the instances for changes and restarts them
 */

const action = require('../actions/watch');

module.exports = async (program, app) => {
	const command = program
		.command('watch')
		.description('Watches the instances for changes and restarts them')
		.action(() => action(app));
};
