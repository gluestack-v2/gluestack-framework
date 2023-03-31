import IPlugin from './IPlugin';
import IGlueStorePlugin from '../../store/interface/IGluePluginStore';
import App from '../../../helpers/lib/app';
export default interface IInstance {
    app: App;
    name: string;
    callerPlugin: IPlugin;
    gluePluginStore: IGlueStorePlugin;
    installationPath: string;
    isOfTypeInstance: boolean;
    init(): any;
    destroy(): any;
    getName(): string;
    getCallerPlugin(): IPlugin;
    getInstallationPath(): string;
    watch(): void;
}
