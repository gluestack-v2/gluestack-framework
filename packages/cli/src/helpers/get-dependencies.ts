import AppCLI from '../helpers/lib/app';

import path from 'path';
import getPlugin from './getPlugin';
import { attachPluginInstances } from './meta/plugin-instances';

const getDependencies = async (app: AppCLI, pluginName: string) => {
	const dependencies = [];

	const packageJSON = path.join(pluginName, 'package.json');

	const peerDependencies =
		require(packageJSON).peerDependencies || {};

	for (const dependency of Object.keys(peerDependencies)) {
		try {
			const plugin = await getPlugin(
				app,
				dependency,
				dependency,
				false
			);

			if (plugin) {
				await attachPluginInstances(app, process.cwd(), [
					{ plugin: plugin },
				]);
				dependencies.push(plugin);
			}
		} catch (err) {
			//
		}
	}

	return dependencies;
};

export default getDependencies;
