import AppCLI from "../helpers/lib/app";
import IPlugin from "./plugin/interface/IPlugin";
import IInstance from "./plugin/interface/IInstance";
import IGlueStorePlugin from "./store/interface/IGluePluginStore";
export default abstract class BaseGluestackPluginInstance implements IInstance {
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
