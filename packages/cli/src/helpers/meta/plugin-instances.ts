import { isEmpty } from 'lodash';
import { error } from '../print';
import { readFile, writeFile } from '../file';
import { getTopToBottomPluginTree } from './plugins';
import { injectPluginInstanceStore } from '../getStorePath';

import IPlugin from '../../types/plugin/interface/IPlugin';
import IManagesInstances from '../../types/plugin/interface/IManagesInstances';
import IArrTree from '../../types/meta/interface/IArr';
import IPluginInstances from '../../types/jsonFiles/interface/IPluginInstances';
import IAppCLI from '../../types/app/interface/IAppCLI';

const pluginInstance = async (
	pluginInstancesFilePath: string,
	packageName: string,
	instanceName: string,
	directoryName: string
) => {
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

async function attachPluginInstances(
	app: IAppCLI,
	path: string,
	plugins: IArrTree
) {
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
}

async function getTopToBottomPluginInstanceTree(
	app: IAppCLI,
	path: string
) {

	const plugins = await getTopToBottomPluginTree(app, path);
	await attachPluginInstances(app, path, plugins);
	return plugins;
}

async function getBottomToTopPluginInstanceTree(
	app: IAppCLI,
	path: string
) {
	const array = await getTopToBottomPluginInstanceTree(app, path);
	return array.reverse();
}

function attachPluginInstance(
	app: IAppCLI,
	plugin: IPlugin & IManagesInstances,
	instance: string,
	directory: string
) {
	return plugin.createInstance(
		instance,
		injectPluginInstanceStore(app, plugin.getName(), instance),
		directory
	);
}

export {
	pluginInstance,
	attachPluginInstances,
	getTopToBottomPluginInstanceTree,
	getBottomToTopPluginInstanceTree,
	attachPluginInstance,
};
