/**
 * Installs the project or plugin
 */

const pluginInit = require('../actions/plugin-init');

module.exports = async (program, app) => {
	const command = program
		.command('plugin:init')
		.description('Initializes the gluestack app as a plugin');

		command
		.command('instance')
		.argument('<plugin-name>', 'Plugin name')
		.description('Initializes the gluestack app as a plugin instance')
		.action((pluginName) => pluginInit(app, pluginName, 'instance'));

		command
		.command('container')
		.argument('<plugin-name>', 'Plugin name')
		.description(
			'Initializes the gluestack app as a container plugin'
		)
		.action((pluginName) => pluginInit(app, pluginName, 'container'));
};
