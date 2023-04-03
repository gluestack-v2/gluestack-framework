import { map } from 'lodash';
import { error } from '../print';
import { readFile } from '../file';
import IPluginInstances from '../../types/jsonFiles/interface/IPluginInstances';

export default async (pluginPath: string, instanceName: string) => {
	const data = (await readFile(pluginPath)) as IPluginInstances;
	if (!data) {
		error(
			'~/.glue/internals files are corrupted. Missing configuration.'
		);
		process.exit(0);
	}

	for (const pluginName of Object.keys(data)) {
		map(data[pluginName], (pluginInstance) => {
			if (pluginInstance.instance === instanceName) {
				error(
					`"${instanceName}" instance already added from plugin "${pluginName}"`
				);
				process.exit(0);
			}
		});
	}
};
