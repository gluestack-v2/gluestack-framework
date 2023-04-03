import { IWatcher, IWatchCallback } from '../types/app/interface/IWatcher';
declare class Watcher implements IWatcher {
    watch(cwd: string, pattern: string | string[], callback: IWatchCallback): void;
}
declare const _default: Watcher;
export default _default;
