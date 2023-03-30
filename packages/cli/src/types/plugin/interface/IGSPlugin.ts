import IAppCLI from "../../app/interface/IAppCLI";
import IGluePluginStore from "../../store/interface/IGluePluginStore";
import IManagesInstances from "./IManagesInstances";
import IPlugin from "./IPlugin";

export default interface IGSPlugin extends IPlugin, IManagesInstances{
  new(appObj: IAppCLI, gluePluginStore: IGluePluginStore): IGSPlugin;
  new(appObj: IAppCLI): IGSPlugin;
}