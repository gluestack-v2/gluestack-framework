export default class Docker {
    private volume;
    private container_name;
    private build;
    private envfile;
    private ports;
    constructor(container_name: string, servicePath: string, build: string, ports: string[], envfile?: string);
    private create;
    private run;
    static start(container_name: string, servicePath: string, build: string, ports: string[], envfile?: string): Promise<void>;
}
