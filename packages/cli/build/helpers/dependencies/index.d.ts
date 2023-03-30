import { docker } from './docker';
import { dockerCompose } from './docker-compose';
import { dockerStatus } from './docker-status';
import { hasura } from './hasura';
import { node } from './node';
import { yarn } from './yarn';
import { npm } from './npm';
import { tsc } from './tsc';
declare const dependencies: {
    docker: string;
    dockerCompose: string;
    dockerStatus: string;
    hasura: string;
    node: string;
    yarn: string;
    npm: string;
};
export { docker, dockerCompose, dockerStatus, hasura, node, yarn, tsc, npm, dependencies, };
