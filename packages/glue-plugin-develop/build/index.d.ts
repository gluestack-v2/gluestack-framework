import AppCLI from '@gluestack-v2/framework-cli/build/helpers/lib/app';
import BaseGluestackPlugin from '@gluestack-v2/framework-cli/build/types/gluestack-plugin';
import IInstance from '@gluestack-v2/framework-cli/build/types/plugin/interface/IInstance';
import IGlueStorePlugin from '@gluestack-v2/framework-cli/build/types/store/interface/IGluePluginStore';
export declare class GlueStackPlugin extends BaseGluestackPlugin {
    app: AppCLI;
    instances: IInstance[];
    type: 'stateless' | 'stateful' | 'devonly';
    gluePluginStore: IGlueStorePlugin;
    constructor(app: AppCLI, gluePluginStore: IGlueStorePlugin);
    init(): void;
    destroy(): void;
    getName(): string;
    getVersion(): string;
    getType(): 'stateless' | 'stateful' | 'devonly';
    getTemplateFolderPath(): string;
    getInstallationPath(target: string): string;
    runPostInstall(instanceName: string, target: string): Promise<void>;
    createInstance(key: string, gluePluginStore: IGlueStorePlugin, installationPath: string): IInstance;
    getInstances(): IInstance[];
}
