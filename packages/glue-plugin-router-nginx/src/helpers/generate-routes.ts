import yaml from 'js-yaml';
import { join } from 'path';
import { readFile, writeFile } from '@gluestack/helpers';
import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import IPlugin from '@gluestack-v2/framework-cli/build/types/plugin/interface/IPlugin';
import { Config, Ingress, Option } from '../types';

export default async function generateRoutes(app: AppCLI): Promise<void> {
  const plugin: IPlugin = app.getPluginByName(
    "@gluestack-v2/glue-plugin-router-nginx",
  ) as IPlugin;

  const path: string = plugin.getInstances()[0]._sourcePath;

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
    const port = ingress.port || undefined;
    if (!domain || !port) {
      console.log('> No domain or port found in config');
      return;
    }

    const locationBlocks = ingress.options.map((option: Option) => {
      const {
        location, rewrite_key, rewrite_value, proxy_pass
      } = option;

      if (!location || !rewrite_key || !rewrite_value || !proxy_pass) {
        console.log('> Missing required option in ingress config');
        return;
      }

      const client_max_body_size = option.client_max_body_size || 50;
      const proxy_http_version = option.proxy_http_version || 1.1;
      const proxy_cache_bypass = option.proxy_cache_bypass || '$http_upgrade';
      const proxy_set_header_upgrade = option.proxy_set_header_upgrade || '$http_upgrade';
      const proxy_set_header_host = option.proxy_set_header_host || '$host';
      const proxy_set_header_connection = option.proxy_set_header_connection || '"upgrade"';
      const proxy_set_header_x_real_ip = option.proxy_set_header_x_real_ip || '$remote_addr';
      const proxy_set_header_x_forwarded_for = option.proxy_set_header_x_forwarded_for || '$proxy_add_x_forwarded_for';
      const proxy_set_header_x_forwarded_proto = option.proxy_set_header_x_forwarded_proto || '$scheme';

      return `
    location ${location} {
      rewrite ${rewrite_key} ${rewrite_value};

      client_max_body_size ${client_max_body_size}M;

      proxy_http_version ${proxy_http_version};
      proxy_set_header Upgrade ${proxy_set_header_upgrade};
      proxy_set_header Host ${proxy_set_header_host};
      proxy_set_header Connection ${proxy_set_header_connection};
      proxy_cache_bypass ${proxy_cache_bypass};
      proxy_set_header X-Real-IP ${proxy_set_header_x_real_ip};
      proxy_set_header X-Forwarded-For ${proxy_set_header_x_forwarded_for};
      proxy_set_header X-Forwarded-Proto ${proxy_set_header_x_forwarded_proto};

      proxy_pass ${proxy_pass};
    }`;
    }).join('\n');

    return `
  server {
    listen ${port};
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
