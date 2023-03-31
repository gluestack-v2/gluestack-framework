import App from './lib/app';
declare const getDependencies: (app: App, pluginName: string) => Promise<any[]>;
export default getDependencies;
