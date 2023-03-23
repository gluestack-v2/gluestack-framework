const { map } = require('lodash');
const { error } = require('../print');
const { readFile } = require('../file');

module.exports = async (pluginPath, pluginName, instanceName) => {
	const data = await readFile(pluginPath);
	if (!data) {
		error('~/.glue/internals files are corrupted. Missing configuration.');
		process.exit(0);
	}

	for (const pluginName of Object.keys(data)) {
		map(data[pluginName], (pluginInstance) => {
			if (pluginInstance.instance === instanceName) {
				error(
					`"${instanceName}" instance already added from plugin "${pluginName}"`
				);
				process.exit(0);
			}
		});
	}
};
