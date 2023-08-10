import chokidar from 'chokidar';
import {
	IWatcher,
	IWatchCallback,
} from '../types/app/interface/IWatcher';
import path from 'path';
import { warning, error } from './print';
class Watcher implements IWatcher {
	private instanceWatcherFlag;
	constructor() {
		this.instanceWatcherFlag = false;
	}
	instanceWatcher() {
		const watcherPath = path.join(
			process.cwd(),
			'.glue',
			'internals',
			'plugin-instances.json'
		);
		const instanceWatcher = chokidar.watch(watcherPath, {
			persistent: true,
			cwd: process.cwd(),
			ignored: [
				'**/node_modules/**',
				'**/dist/**',
				'**/build/**',
				'**/.next/**',
			],
		});

		instanceWatcher.on(
			'change',
			async (_event: string, _path: string) => {
				warning('New plugin instance detected, restart your app!');
			}
		);
	}
	watch(
		cwd: string,
		pattern: string | string[],
		callback: IWatchCallback
	): void {
		const globs = typeof pattern === 'string' ? [pattern] : pattern;

		try {
			const watcher: chokidar.FSWatcher = chokidar.watch(globs, {
				persistent: true,
				cwd: cwd,
				ignored: [
					'**/node_modules/**',
					'**/dist/**',
					'**/build/**',
					'**/.next/**',
				],
			});

			watcher.on('all', async (event: string, path: string) => {
				if (callback) callback(event, path);
			});
			if (!this.instanceWatcherFlag) {
				this.instanceWatcher();
				this.instanceWatcherFlag = true;
			}
		} catch (err: any) {
			error('> watcher error:', err);
		}
	}
}

export default new Watcher();
