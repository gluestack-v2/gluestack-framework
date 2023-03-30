import chokidar from 'chokidar';
import { WatchCallback } from '../types/app/interface/IAppCLI';

interface Watcher {
  watch: (cwd: string, pattern: string | string[], callback: any) => void;
}

const watcher: Watcher = {
  watch: (cwd: string, pattern: string | string[], callback: any): void => {
    const globs = typeof pattern === 'string' ? [pattern] : pattern;

    console.log(`Watching ${cwd} for changes...`);
    console.log(globs);

    try {
      chokidar.watch(globs, {
        persistent: true,
        cwd: cwd,
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/.next/**',
        ]
      }).on('all', async (event: string, path: string) => console.log('>> here'));

      if (callback) callback();
    } catch (err) {
      console.log('> error', err);
    }
  }
};

export default watcher;
