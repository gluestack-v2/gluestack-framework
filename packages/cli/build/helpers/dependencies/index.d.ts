import { docker } from "./docker";
import { dockerCompose } from "./docker-compose";
import { dockerStatus } from "./docker-status";
import { hasura } from "./hasura";
import { node } from "./node";
import { yarn } from "./yarn";
import { tsc } from "./tsc";
import { npm } from "./npm";
export namespace dependencies {
    const docker: string;
    const dockerCompose: string;
    const dockerStatus: string;
    const hasura: string;
    const node: string;
    const yarn: string;
    const npm: string;
}
export { docker, dockerCompose, dockerStatus, hasura, node, yarn, tsc, npm };
