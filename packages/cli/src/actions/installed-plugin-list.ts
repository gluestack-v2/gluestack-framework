import { info, newline, warning } from '../helpers/print';
import {
	getTopToBottomPluginTree,
} from '../helpers/meta/plugins';
import {
	getTopToBottomPluginInstanceTree,
} from '../helpers/meta/plugin-instances';

import IArrTree from '../types/meta/interface/IArr';
import IArrVersion from '../types/actions/interface/IArrVersion';
import IPluginArray from '../types/actions/interface/IArrPluginDetails';
import App from '../helpers/lib/app';

function printPlugins(plugins: IArrTree) {
	const arr: IArrVersion = {};
	plugins.map((plugin) => {
		if (!arr[plugin.key as string]) {
			arr[plugin.key as string] = {
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

async function printInstalledPlugins(app: App) {
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
					plugin: key as string,
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

async function printInstalledPluginInstances(app: App) {
	const plugins = await getTopToBottomPluginInstanceTree(
		app,
		process.cwd()
	);
	printPluginInstances(plugins);
	newline();
}

export default async (app: App) => {
	await printInstalledPlugins(app);
	await printInstalledPluginInstances(app);
};
