import AppCLI from '../helpers/lib/app';
import { injectPluginStore } from './getStorePath';
import { error } from './print';

function getPlugin(
	app: AppCLI,
	path: string,
	pluginName: string = '',
	throwErrorAndExit: Boolean = false
) {
	try {
		const { GlueStackPlugin } = require(path);
		return new GlueStackPlugin(
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
