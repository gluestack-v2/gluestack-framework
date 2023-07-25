import yaml from 'js-yaml';
import { Config, Ingress, Option } from '../types';
import { ConsoleTable, readFile } from '@gluestack/helpers';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';

export default async function generateRoutes(_app: AppCLI): Promise<void> {
  const configYaml = await readFile('bolt.yaml', 'utf8');
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
    'Port',
    'Location',
    'Proxy Pass',
    'Rewrite Key',
    'Rewrite Value',
    'Client MaxBody (in MB)',
  ];

  config.ingress.forEach((ingress: Ingress) => {
    const domain = ingress.domain || undefined;
    const port = ingress.port || undefined;
    if (!domain || !port) {
      console.error('> No domain or port found in config');
      return;
    }

    ingress.options.forEach((option: Option) => {
      const { location, rewrite_key, rewrite_value, proxy_pass } = option;

      if (!location || !rewrite_key || !rewrite_value || !proxy_pass) {
        console.error('> Missing required option in ingress config');
        return;
      }

      const client_max_body_size = option.client_max_body_size || 50;

      rows.push([
        domain,
        `${port}`,
        location,
        proxy_pass,
        rewrite_key,
        rewrite_value,
        `${client_max_body_size}`,
      ]);
    });
  });

  await ConsoleTable.print(head, rows);
}
