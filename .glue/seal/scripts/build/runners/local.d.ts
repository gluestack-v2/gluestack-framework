export default class Local {
    private volume;
    private build;
    constructor(servicePath: string, build: string);
    private run;
    static start(servicePath: string, build: string): Promise<void>;
}
