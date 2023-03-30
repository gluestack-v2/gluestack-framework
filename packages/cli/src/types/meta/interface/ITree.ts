import IGSPlugin from '../../plugin/interface/IGSPlugin';

export default interface Tree {
	[key: string]: {
		plugin: IGSPlugin;
		dependencies: Tree | null;
	};
}
