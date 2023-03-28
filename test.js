
let i = 0;

// macro tasks
setTimeout(() => {
  console.log('timeout', i++);
}, 0);

setImmediate(() => {
  console.log('immediate', i++);
});

// micro tasks
queueMicrotask(() => {
  console.log('microtask', i++);
});

process.nextTick(() => {
  console.log('nextTick', i++);
});

new Promise((resolve, _reject) => {
  console.log('promise', i++);
  resolve();
});
