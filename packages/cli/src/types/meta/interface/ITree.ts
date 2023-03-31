
import IPlugin from '../../plugin/interface/IPlugin';

export default interface Tree {
	[key: string]: {
		plugin: IPlugin;
		dependencies: Tree | null;
	};
}
