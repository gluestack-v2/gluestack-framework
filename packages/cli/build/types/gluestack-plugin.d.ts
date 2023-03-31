import AppCLI from "../helpers/lib/app";
import IPlugin from "./plugin/interface/IPlugin";
import IInstance from "./plugin/interface/IInstance";
import IGluePluginStore from "./store/interface/IGluePluginStore";
export default abstract class BaseGluestackPlugin implements IPlugin {
    app: AppCLI;
    instances: IInstance[];
    type: "stateless" | "stateful" | "devonly";
    gluePluginStore: IGluePluginStore;
    constructor(app: AppCLI, gluePluginStore: IGluePluginStore);
    abstract init(): void;
    abstract destroy(): void;
    abstract getVersion(): string;
    abstract getName(): string;
    abstract runPostInstall(instanceName: string, target: string): void;
    abstract createInstance(key: string, gluePluginStore: IGluePluginStore, installationPath: string): IInstance;
    getType(): 'stateless' | 'stateful' | 'devonly';
    getTemplateFolderPath(): string;
    getInstallationPath(target: string): string;
    getInstances(): IInstance[];
}
