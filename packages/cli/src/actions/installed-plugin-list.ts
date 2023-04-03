import { error, info, newline, warning } from '../helpers/print';
import { getTopToBottomPluginTree } from '../helpers/meta/plugins';
import { getTopToBottomPluginInstanceTree } from '../helpers/meta/plugin-instances';

import AppCLI from '../helpers/lib/app';
import IArrTree from '../types/meta/interface/IArr';
import IArrVersion from '../types/actions/interface/IArrVersion';
import IPluginArray from '../types/actions/interface/IArrPluginDetails';
import IInstance from '../types/plugin/interface/IInstance';

const printPlugins = (plugins: IArrTree) => {
	const arr: IArrVersion = {};

	plugins.forEach((plugin) => {
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
};

const printInstalledPlugins = async (app: AppCLI) => {
	const plugins = await getTopToBottomPluginTree(app, process.cwd());
	printPlugins(plugins);
	newline();
};

const printPluginInstances = (plugins: IArrTree) => {
	const arr: IPluginArray = [];

	plugins.forEach(({ key, plugin }) => {
		if (plugin.getInstances) {
			plugin.getInstances().forEach((pluginInstance: IInstance) => {
				arr.push({
					plugin: key as string,
					instance: pluginInstance.getName(),
					directory: pluginInstance.getInstallationPath
						? pluginInstance.getInstallationPath()
						: '',
					version: plugin.getVersion(),
				});
			});
		}
	});

	if (Object.keys(arr).length) {
		info('Installed Instances');
		console.table(arr);
		return;
	}

	warning('No instances are installed in your app.');
};

const printInstalledPluginInstances = async (app: AppCLI) => {
	const plugins = await getTopToBottomPluginInstanceTree(
		app,
		process.cwd()
	);
	printPluginInstances(plugins);
	newline();
};

export default async (app: AppCLI) => {
	if (!app.plugins.length) {
		error('Nothing installed in your app.', 'Please install one plugin and try again.');
		process.exit(-1);
	}

	await printInstalledPlugins(app);
	await printInstalledPluginInstances(app);
};
