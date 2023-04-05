import yaml from 'js-yaml';
import { join } from 'path';
import { readFile, writeFile } from '@gluestack/helpers';
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

  const serverBlocks = config.ingress.map((ingress: Ingress) => {
    const domain = ingress.domain || undefined;
    if (!domain) {
      console.log('> No domain found in config');
      return;
    }

    const locationBlocks = ingress.options.map((option: Option) => {
      const location = option.location;
      const rewriteKey = option.rewrite_key;
      const rewriteValue = option.rewrite_value;
      const containerName = option.container_name;

      if (!location || !rewriteKey || !rewriteValue || !containerName) {
        console.log('> Missing required option in ingress config');
        return;
      }

      const sizeInMB = option.size_in_mb || 50;

      return `
    location ${location} {
      rewrite ${rewriteKey} ${rewriteValue};

      client_max_body_size ${sizeInMB}M;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_cache_bypass $http_upgrade;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_pass http://${containerName};
    }`;
    }).join('\n');

    return `
  server {
    listen ${port++};
    server_name ${domain};
    ${locationBlocks}
  }`;
  }).join('\n');

  const nginxConfig = `
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
    '\$status \$body_bytes_sent "\$http_referer" '
    '"\$http_user_agent" "\$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log main;

  sendfile on;
  keepalive_timeout 65;

  gzip on;
  gzip_disable "msie6";
  gzip_comp_level 6;
  gzip_min_length 1100;
  gzip_buffers 16 8k;
  gzip_proxied any;
  gzip_types
    text/plain
    text/css
    text/js
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml
    application/rss+xml
    image/svg+xml;
  ${serverBlocks}
}
`;

  await writeFile(
    join(path, 'nginx.conf'),
    nginxConfig
  );
};
