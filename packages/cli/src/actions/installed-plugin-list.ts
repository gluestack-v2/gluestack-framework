import { info, newline, warning } from '../helpers/print';
import {
	getTopToBottomPluginTree,
} from '../helpers/meta/plugins';
import {
	getTopToBottomPluginInstanceTree,
} from '../helpers/meta/plugin-instances';
import IArrTree from '../types/meta/interface/IArr';
import IArrVersion from '../types/actions/interface/IArrVersion';
import IAppCLI from '../types/app/interface/IAppCLI';
import IGSPlugin from '../types/plugin/interface/IGSPlugin';
import IPluginArray from '../types/actions/interface/IArrPluginDetails';

function printPlugins(plugins: IArrTree) {
	const arr: IArrVersion = {};
	plugins.map((plugin) => {
		if (!arr[plugin.key]) {
			arr[plugin.key] = {
				version: plugin.plugin.getVersion(),
			};
		}
	});

	if (Object.keys(arr).length) {
		info('Installed Plugins');
		console.table(arr);
		return;
	}

	warning('No plugins are installed in your app.');
}

async function printInstalledPlugins(app: IAppCLI) {
	const plugins = await getTopToBottomPluginTree(app, process.cwd());
	printPlugins(plugins);
	newline();
}

function printPluginInstances(plugins: IArrTree) {
	const arr: IPluginArray = [];
	plugins.map(({ key, plugin }) => {
		if (plugin.getInstances) {
			plugin.getInstances().forEach((pluginInstance) => {
				arr.push({
					plugin: key,
					instance: pluginInstance.getName(),
					directory: pluginInstance.getInstallationPath
						? pluginInstance.getInstallationPath()
						: '',
					version: plugin.getVersion(),
				});
			})
		}
	});

	if (Object.keys(arr).length) {
		info('Installed Instances');
		console.table(arr);
		return;
	}

	warning('No instances are installed in your app.');
}

async function printInstalledPluginInstances(app: IAppCLI) {
	const plugins = await getTopToBottomPluginInstanceTree(
		app,
		process.cwd()
	);
	printPluginInstances(plugins);
	newline();
}

module.exports = async (app: IAppCLI) => {
	await printInstalledPlugins(app);
	await printInstalledPluginInstances(app);
};
