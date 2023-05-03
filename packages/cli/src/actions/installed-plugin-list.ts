import 'colors';
import { ConsoleTable } from '@gluestack/helpers';

import { error, info, newline, warning } from '../helpers/print';
import { getTopToBottomPluginTree } from '../helpers/meta/plugins';
import { getTopToBottomPluginInstanceTree } from '../helpers/meta/plugin-instances';

import AppCLI from '../helpers/lib/app';
import IArrTree from '../types/meta/interface/IArr';
import IInstance from '../types/plugin/interface/IInstance';

const printPlugins = (plugins: IArrTree) => {
	const arr = [] as Array<Array<string>>;

	plugins.forEach((plugin) => {
		const pluginName = [plugin.key, plugin.plugin.getVersion()] as string[];

		if (!arr.includes(pluginName)) {
			arr.push(pluginName);
		}
	});

	if (arr.length > 0) {
		info('Installed Plugins');
		const head = ['Plugin', 'Version'];
		ConsoleTable.print(head, arr);
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
	const arr = [] as Array<Array<string>>;

	plugins.forEach(({ key, plugin }, index) => {
		if (plugin.getInstances) {
			plugin.getInstances().forEach((pluginInstance: IInstance) => {
				const installationPath = pluginInstance._destinationPath || '';
				const pluginInstanceArr = [key, pluginInstance.getName(), installationPath, plugin.getVersion()] as string[];
				arr.push(pluginInstanceArr);
			});
		}
	});

	if (arr.length > 0) {
		info('Installed Instances');

		const head = ['Plugin', 'Instance', 'Path', 'Version'];
		ConsoleTable.print(head, arr);
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
