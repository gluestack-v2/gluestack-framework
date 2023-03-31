import App from './lib/app';

import { injectPluginStore } from './getStorePath';
import { error } from './print';

function getPlugin(
	app: App,
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
