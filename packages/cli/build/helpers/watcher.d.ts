interface Watcher {
    watch: (cwd: string, pattern: string | string[], callback: any) => void;
}
declare const watcher: Watcher;
export default watcher;
