import AppCLI from "../helpers/lib/app";
import IInstance from "./plugin/interface/IInstance";
import IGlueStorePlugin from "./store/interface/IGluePluginStore";
import ILifeCycle from "./plugin/interface/ILifeCycle";
import IPlugin from "./plugin/interface/IPlugin";
export default abstract class BaseGluestackPluginInstance implements IInstance, ILifeCycle {
    app: AppCLI;
    name: string;
    callerPlugin: IPlugin;
    isOfTypeInstance: boolean;
    gluePluginStore: IGlueStorePlugin;
    installationPath: string;
    constructor(app: AppCLI, callerPlugin: IPlugin, name: string, gluePluginStore: IGlueStorePlugin, installationPath: string);
    abstract init(): void;
    abstract destroy(): void;
    abstract watch(): string[];
    getName(): string;
    getCallerPlugin(): IPlugin;
    getInstallationPath(): string;
}
