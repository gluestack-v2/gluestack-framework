import IAppCLI from "../../app/interface/IAppCLI";
import IGluePluginStore from "../../store/interface/IGluePluginStore";
import ILifeCycle from "./ILifeCycle";
import IManagesInstances from "./IManagesInstances";
import IPlugin from "./IPlugin";
export default interface IGSPlugin extends IPlugin, ILifeCycle, IManagesInstances {
    new (appObj: IAppCLI, gluePluginStore: IGluePluginStore): IGSPlugin;
    new (appObj: IAppCLI): IGSPlugin;
}
