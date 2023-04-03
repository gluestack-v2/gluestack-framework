import { error } from '../print';
import { spawn, SpawnOptions } from 'child_process';

const hasura = async () =>
	new Promise((resolve, reject) => {
		const options: SpawnOptions =
			process.platform === 'win32'
				? { shell: true }
				: { shell: false };
		const _spawn = spawn('hasura', ['version'], options);

		_spawn.on('error', () => {
			return reject(`"HASURA CLI" is installed?`);
		});

		if (_spawn?.stdout)
			_spawn?.stdout.on('data', (data) => {
				data = JSON.parse(data.toString())
					.version.replace(/[^\d.]/g, '')
					.replace(/\.\d+/g, '');
				if (data < 2) {
					error(
						`"HASURA" version must be greater than or equal to 2`
					);
					return reject();
				}
			});

		_spawn.on('exit', (result) => {
			if (result) {
				return reject(`"HASURA CLI" is installed?`);
			}
			return resolve(`"HASURA CLI" is installed?`);
		});
	});

export { hasura };
