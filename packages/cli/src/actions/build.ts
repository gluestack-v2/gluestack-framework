import AppCLI from '../helpers/lib/app';
import { error, success, warning } from '../helpers/print';

export default async (app: AppCLI): Promise<void> => {
	for await (const plugin of app.plugins) {
		success('Found plugin', plugin.getName());

		if (!plugin.build) {
			warning(
				`${plugin.getName()}`,
				'contains no build method, skipping'
			);
			continue;
		}

		warning(plugin.getName(), 'building...');
		try {
			await plugin.build();
		} catch (e) {
			error(plugin.getName(), 'build failed');
		}
	}
};
