import IInstance from './IInstance';
import IGlueStorePlugin from '../../store/interface/IGluePluginStore';
export default interface IPlugin {
    gluePluginStore: IGlueStorePlugin;
    type: 'stateless' | 'stateful' | 'devonly';
    instances: IInstance[];
    init(): any;
    destroy(): any;
    getName(): string;
    getVersion(): string;
    getInstallationPath(target: string): string;
    getType(): 'stateless' | 'stateful' | 'devonly';
    runPostInstall(instanceName: string, target: string): any;
    getTemplateFolderPath(): string;
    createInstance(key: string, gluePluginStore: IGlueStorePlugin, installationPath: string): IInstance;
    getInstances(): IInstance[];
}
