import IManagesInstances from '../../plugin/interface/IManagesInstances';
import IPlugin from '../../plugin/interface/IPlugin';

export interface ArrObj {
	key: string;
	plugin: IPlugin & IManagesInstances;
}

type IArrTree = ArrObj[];

export default IArrTree;
