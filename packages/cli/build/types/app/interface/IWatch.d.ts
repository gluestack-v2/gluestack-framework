export interface IWatcher {
    watch: (cwd: string, pattern: string | string[], callback: IWatchCallback) => void;
}
export type IWatchCallback = (event: string, path: string) => void;
