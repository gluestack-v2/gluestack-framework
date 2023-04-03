import chokidar from 'chokidar';
import { IWatcher, IWatchCallback } from '../types/app/interface/IWatcher';

class Watcher implements IWatcher {
	watch(cwd: string, pattern: string | string[], callback: IWatchCallback): void {
		const globs = typeof pattern === 'string' ? [pattern] : pattern;

		try {
			chokidar
				.watch(globs, {
					persistent: true,
					cwd: cwd,
					ignored: [
						'**/node_modules/**',
						'**/dist/**',
						'**/build/**',
						'**/.next/**',
					],
				})
				.on('all', async (event: string, path: string) => {
					if (callback) callback(event, path);
				});
		} catch (err) {
			console.log('> watcher error:', err);
		}
	}
}

export default new Watcher();
