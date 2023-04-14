
import dotenv from 'dotenv';
import { relative, join } from 'path';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import { error, info, success, warning } from '@gluestack-v2/framework-cli/build/helpers/print';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';

import { GlueStackPlugin } from '../../index';
import { execute } from '../../helpers/spawn';
import { fileExists } from '../../helpers/file-exists';
import { writeFile } from 'fs/promises';

export default async (app: AppCLI, prompt: string): Promise<void> => {
	if (!prompt || prompt === '') {
		error(`Prompt is empty!`);
		process.exit(1);
	}

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

	const dictionary: string = join(
		process.cwd(),
		instance.getInstallationPath(),
		'index.json'
	);
	if (!dictionary) {
		error(`Plugin "${pluginName}"`, `dictionary file at location "${relative('.', dictionary)}" not found`);
		warning('Please run "node glue ai:construct"!');
		process.exit(1);
	}

	const envfilepath: string = join(process.cwd(), instance.getInstallationPath(), '.env');
	if (!await fileExists(envfilepath)) {
		error(`Plugin "${pluginName}"`, ` env file at location "${relative('.', envfilepath)}" not found`);
		process.exit(1);
	}

	dotenv.config({ path: envfilepath });

	if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.endsWith('xxxx')) {
		error(`Plugin "${pluginName}"`, `OPENAI_API_KEY at location "${relative('.', envfilepath)}" is invalid`);
		process.exit(1);
	}

	warning('Please wait while we work with your prompt & openai...');

	const response = await execute('python', [
		plugin.getRunFilepath(),
		prompt
	], {});

	await saveResponseToWebPlugin(app, prompt, response);
};

const saveResponseToWebPlugin = async (app: AppCLI, prompt: string, response: any) => {
	const pluginName: string = '@gluestack-v2/glue-plugin-web';
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

	info(`Found "${instance.getName()}" instance`, `plugin "${pluginName}"`);

	const filepath: string = join(instance.getInstallationPath(), 'pages/index.tsx');
	if (!await fileExists(filepath)) {
		error(`Instance "${instance.getName()}"`, `file at location "${relative('.', filepath)}" not found`);
		process.exit(1);
	}

	let content: string = response.split('##START##')[1].trim();
	content = content.split('##DONE##')[0].trim();

	// prefix prompt with //
	content = `@prompt: ${prompt}\n${content}`;

	await writeFile(filepath, trimContent(content));

	success(`Instance "${instance.getName()}"`, `saved response to ${relative('.', filepath)}`);
};

const trimContent = (output: string): string => {
	const codeRegex = /```(|jsx|javascript|typescript|ts|tsx)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match = null;
  let result = '';

  while ((match = codeRegex.exec(output)) !== null) {
    const [fullMatch, language, code] = match;
    const textBefore = output.substring(lastIndex, match.index).trim();
    if (textBefore.length > 0) {
      result += textBefore.split('\n').map(line => `// ${line}`).join('\n');
      result += '\n';
    }
    result += `// Start of ${language} code block\n`;
    result += code;
    result += `// End of ${language} code block\n`;
    lastIndex = match.index + fullMatch.length;
  }

  const textAfter = output.substring(lastIndex).trim();
  if (textAfter.length > 0) {
    result += textAfter.split('\n').map(line => `// ${line}`).join('\n');
    result += '\n';
  }

  return result;
}
