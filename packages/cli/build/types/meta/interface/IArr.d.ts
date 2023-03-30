import IGSPlugin from '../../plugin/interface/IGSPlugin';
export interface ArrObj {
    key?: string;
    plugin: IGSPlugin;
}
type IArrTree = ArrObj[];
export default IArrTree;
