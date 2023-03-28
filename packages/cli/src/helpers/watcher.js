const chokidar = require('chokidar');

const watcher = {};

watcher.watch = (cwd, pattern, callback) => {
  const globs = typeof pattern === 'string'
    ? [pattern] : pattern;

  console.log(`Watching ${cwd} for changes...`);
  console.log(globs);

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
        ]
      })
      .on('all', async (event, path) => console.log('>> here'));
  } catch (err) {
    console.log('> error', err);
  }
};

module.exports = watcher;
