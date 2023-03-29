import IManagesInstances from '../../plugin/interface/IManagesInstances';
import IPlugin from '../../plugin/interface/IPlugin';

export default interface Tree {
	[key: string]: {
		plugin: IPlugin & IManagesInstances;
		dependencies: Tree | null;
	};
}
