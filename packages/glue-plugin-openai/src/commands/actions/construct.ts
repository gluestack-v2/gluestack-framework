
import dotenv from 'dotenv';
import { relative, join } from 'path';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error, success } from '@gluestack-v2/framework-cli/build/helpers/print';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import { GlueStackPlugin } from '../../index';
import { execute } from '../../helpers/spawn';
import { fileExists } from '../../helpers/file-exists';

export default async (app: AppCLI): Promise<void> => {
	const pluginName: string = '@gluestack-v2/glue-plugin-openai';
	const plugin: GlueStackPlugin = app.getPluginByName(pluginName) as GlueStackPlugin;
	if (!plugin) {
		error(`Plugin "${pluginName}"`, 'not found');
		process.exit(1);
	}

	const instance: IInstance = plugin.getInstances()[0];
	if (!instance) {
		error(`Plugin "${pluginName}"`, 'instance not found');
		process.exit(1);
	}

	const envfilepath: string = join(process.cwd(), instance._sourcePath, '.env');
	if (!await fileExists(envfilepath)) {
		error(`Plugin "${pluginName}"`, `env file at location "${relative('.', envfilepath)}" not found`);
		process.exit(1);
	}

	dotenv.config({ path: envfilepath });

	if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.endsWith('xxxx')) {
		error(`Plugin "${pluginName}"`, `OPENAI_API_KEY at location "${relative('.', envfilepath)}" is invalid`);
		process.exit(1);
	}

	await execute('python', [
		plugin.getConstructFilepath()
	], {
		stdio: 'inherit'
	});

	success('Training data constructed successfully!');
};
