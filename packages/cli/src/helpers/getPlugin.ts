import IAppCLI from '../types/app/interface/IAppCLI';
import { injectPluginStore } from './getStorePath';
import { error } from './print';

function getPlugin(
	app: IAppCLI,
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
