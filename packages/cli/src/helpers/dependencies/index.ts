import { docker } from './docker';
import { dockerCompose } from './docker-compose';
import { dockerStatus } from './docker-status';
import { hasura } from './hasura';
import { node } from './node';
import { yarn } from './yarn';
import { npm } from './npm';
import { tsc } from './tsc';

const dependencies = {
	docker: 'docker',
	dockerCompose: 'dockerCompose',
	dockerStatus: 'dockerStatus',
	hasura: 'hasura',
	node: 'node',
	yarn: 'yarn',
	npm: 'npm',
};

export {
	docker,
	dockerCompose,
	dockerStatus,
	hasura,
	node,
	yarn,
	tsc,
	npm,
	dependencies,
};
