import { join, relative } from 'path';

import { exists } from '../helpers/fs-exists';
import { parseYAML } from '../helpers/parse-yaml';
import { exitWithMsg } from '../helpers/exit-with-msg';

import { SealService } from '../typings/seal-service';
import { RunServiceOptions } from '../typings/run-service-options';

import { validateSealService } from '../validations/seal-service';

import Local from '../runners/local';
import Docker from '../runners/docker';

export default async (
  directoryName: string, options: RunServiceOptions
): Promise<void> => {
  const { platform, ports } = options;

  // if platform is docker and ports are not provided, exit
  if (platform === 'docker' && ports.length <= 0) {
    await exitWithMsg('> ports are required in case platform is docker');
  }

  // if platform is local and ports are provided, exit
  if (platform === 'local' && ports.length > 0) {
    await exitWithMsg('> ports are not required in case platform is local');
  }

  // if service doesn't exists, exit
  const servicePath: string = join(process.cwd(), '..', 'services', directoryName);
  if (!await exists(servicePath)) {
    await exitWithMsg(`> service ${relative('.', servicePath)} doesn't exists`);
  }

  // check if given service has a seal.service.yaml or a seal.service.yml file
  const _yamlPath: string | boolean = await exists(join(servicePath, 'seal.service.yaml'));
  const _ymlPath: string | boolean = await exists(join(servicePath, 'seal.service.yml'));

  // if both yaml as well as yml doesn't exists, exit
  if (!_yamlPath && !_ymlPath) {
    await exitWithMsg(`> service ${relative('.', join(servicePath, 'seal.service.yaml'))} file doesn't exists`);
  }

  // if seal.service.yaml doesn't exists, use seal.service.yml instead
  const yamlPath: string = (_yamlPath ? _yamlPath : _ymlPath) as string;
  const content: SealService = await validateSealService(
    await parseYAML(yamlPath)
  );

  // if service doesn't contain given platform, exit
  if (!content.platforms[platform]) {
    await exitWithMsg(`service ${relative('.', join(servicePath, 'seal.service.yaml'))} file doesn't contain ${platform} platform`);
  }

  const { envfile, build } = content.platforms[platform];

  switch (platform) {
    case 'docker':
      await Docker.start(content.container_name, servicePath, build, ports, envfile);
      break;
    case 'local':
      await Local.start(servicePath, build);
      break;
  }
};
