import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error, success, warning } from '@gluestack-v2/framework-cli/build/helpers/print';

import { FOLDER_STRUCTURE } from '../../constants/folder-structure';
import createFoldersFromJson from '../../helpers/create-folders-from-json';

export default async (app: AppCLI): Promise<void> => {
	// creates folders from FOLDER_STRUCTURE constant
	await createFoldersFromJson(FOLDER_STRUCTURE, process.cwd());

	// builds plugins
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
