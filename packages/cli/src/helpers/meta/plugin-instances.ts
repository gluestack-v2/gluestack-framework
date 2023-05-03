import { isEmpty } from 'lodash';
import { error } from '../print';
import { readFile, writeFile } from '../file';
import { getTopToBottomPluginTree } from './plugins';
import { injectPluginInstanceStore } from '../getStorePath';

import AppCLI from '../../helpers/lib/app';
import IArrTree from '../../types/meta/interface/IArr';
import IPlugin from '../../types/plugin/interface/IPlugin';
import IPluginInstances from '../../types/jsonFiles/interface/IPluginInstances';

export const pluginInstance = async (
	pluginInstancesFilePath: string,
	packageName: string,
	instanceName: string,
	directoryName: string
): Promise<void> => {
	let data = (await readFile(
		pluginInstancesFilePath
	)) as IPluginInstances;

	if (!data) {
		error('~/.glue/internals plugin instances file is corrupted.');
		process.exit(0);
	}

	if (!data[packageName]) {
		data[packageName] = [];
	}

	data[packageName].push({
		instance: instanceName,
		directory: directoryName,
		container_store: {},
	});

	// write pluginInstances in file
	await writeFile(
		pluginInstancesFilePath,
		JSON.stringify(data, null, 2)
	);
};

export const attachPluginInstances = async (
	app: AppCLI,
	path: string,
	plugins: IArrTree
): Promise<void> => {
	const pluginInstancesFilePath = `${path}/.glue/internals/plugin-instances.json`;

	const pluginInstances = (await readFile(
		pluginInstancesFilePath
	)) as IPluginInstances;

	if (!pluginInstances || isEmpty(pluginInstances)) {
		return;
	}

	for (const { plugin } of plugins) {
		const instances = pluginInstances[plugin.getName()];
		if (instances) {
			for (const { instance, directory } of instances) {
				attachPluginInstance(app, plugin, instance, directory);
			}
		}
	}
};

export const getTopToBottomPluginInstanceTree = async (
	app: AppCLI,
	path: string
) => {
	const plugins = await getTopToBottomPluginTree(app, path);
	await attachPluginInstances(app, path, plugins);

	return plugins;
};

export const getBottomToTopPluginInstanceTree = async (
	app: AppCLI,
	path: string
) => {
	const array = await getTopToBottomPluginInstanceTree(app, path);
	return array.reverse();
};

export const attachPluginInstance = (
	app: AppCLI,
	plugin: IPlugin,
	instance: string,
	directory?: string
) => {
	return plugin.createInstance(
		instance,
		injectPluginInstanceStore(app, plugin.getName(), instance),
		directory
	);
};
