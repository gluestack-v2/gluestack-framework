import IPlugin from '../../plugin/interface/IPlugin';

export interface ArrObj {
	key?: string;
	plugin: IPlugin;
}

type IArrTree = ArrObj[];

export default IArrTree;
