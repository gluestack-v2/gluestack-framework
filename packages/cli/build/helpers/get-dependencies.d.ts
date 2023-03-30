import IAppCLI from '../types/app/interface/IAppCLI';
declare const getDependencies: (app: IAppCLI, pluginName: string) => Promise<any[]>;
export default getDependencies;
