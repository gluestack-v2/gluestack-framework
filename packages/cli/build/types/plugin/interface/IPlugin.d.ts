import App from '../../../helpers/lib/app';
import IGluePluginStore from '../../store/interface/IGluePluginStore';
import IInstance from './IInstance';
export default interface IPlugin {
    app: App;
    gluePluginStore: IGluePluginStore;
    instances: IInstance[];
    init(): void;
    getName(): string;
    getVersion(): string;
    createInstance(key: string, gluePluginStore: IGluePluginStore, installationPath: string): IInstance;
    getInstances(): IInstance[];
    destroy(): void;
}
export interface ITSPlugin extends IPlugin {
    new (appObj: App, gluePluginStore: IGluePluginStore): IPlugin;
    new (appObj: App): IPlugin;
}
