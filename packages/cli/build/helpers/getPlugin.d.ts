import IAppCLI from '../types/app/interface/IAppCLI';
declare function getPlugin(app: IAppCLI, path: string, pluginName?: string, throwErrorAndExit?: Boolean): any;
export default getPlugin;
