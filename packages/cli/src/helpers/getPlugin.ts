import AppCLI from '../helpers/lib/app';
import { injectPluginStore } from './getStorePath';
import { error } from './print';

function getPlugin(
	app: AppCLI,
	path: string,
	pluginName: string = '',
	throwErrorAndExit: boolean = false
) {
	try {
		const plugin = require(path);
		if (!plugin.GlueStackPlugin) {
			return;
		}

		return new plugin.GlueStackPlugin(
			app,
			injectPluginStore(app, pluginName)
		);
	} catch (e) {
		if (throwErrorAndExit) {
			error('Plugin not initialized');
			process.exit(0);
		}
	}
}

export default getPlugin;
