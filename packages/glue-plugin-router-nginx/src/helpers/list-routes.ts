import yaml from 'js-yaml';
import { join } from 'path';
import { ConsoleTable, readFile, writeFile } from '@gluestack/helpers';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';

interface Option {
  location: string;
  rewrite_key: string;
  rewrite_value: string;
  container_name: string;
  size_in_mb?: number;
}

interface Ingress {
  domain: string;
  options: Option[];
}

interface Config {
  ingress: Ingress[];
}

export default async function generateRoutes(app: AppCLI): Promise<void> {
  const plugin: IPlugin = app.getPluginByName(
    "@gluestack-v2/glue-plugin-router-nginx",
  ) as IPlugin;

  const path: string = plugin.getInstances()[0].getInstallationPath();

  let port: number = 7000;

  const configYaml = await readFile('seal.yaml', 'utf8');
  let config: Config;

  try {
    config = yaml.load(configYaml, { schema: yaml.JSON_SCHEMA }) as Config;
  } catch (e) {
    console.error('Failed to parse config YAML:', e);
    process.exit(1);
  }

  if (!config.ingress || config.ingress.length === 0) {
    console.error('No ingress found in config');
    process.exit(-1);
  }

  const rows = [] as Array<Array<string>>;
  const head: Array<string> = [
    'Domain',
    'Location',
    'Container Name',
    'Rewrite Key',
    'Rewrite Value',
    'Size in MB'
  ];

  config.ingress.forEach((ingress: Ingress) => {
    const domain = ingress.domain || undefined;
    if (!domain) {
      console.log('> No domain found in config');
      return;
    }

    ingress.options.forEach((option: Option) => {
      const location = option.location;
      const rewriteKey = option.rewrite_key;
      const rewriteValue = option.rewrite_value;
      const containerName = option.container_name;

      if (!location || !rewriteKey || !rewriteValue || !containerName) {
        console.log('> Missing required option in ingress config');
        return;
      }

      const sizeInMB = option.size_in_mb || 50;

      rows.push([
        domain,
        location,
        containerName,
        rewriteKey,
        rewriteValue,
        `${sizeInMB}`
      ]);
    });
  });

  await ConsoleTable.print(head, rows);
};
