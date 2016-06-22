var Log = require('./lib');

Log.addLevel({
  name: 'DANGER',
  scale: 2,
  method: 'danger',
  console: 'warn'
});

Log.addLevel({
  name: 'FATAL',
  scale: 0,
  method: 'fatal',
  console: 'error'
});

var log1 = new Log('app1', {
  scale: 1,
  displayTime: true
});

var log2 = new Log('app2', {
  scale: 3,
  displayTime: true
});

log1.debug('message', 1);
log1.info('message', 2);
log1.warn('message', 3);
log1.danger('message', 4);
log1.error('message', 5);
log1.fatal('message', 6);

console.log('----------');

log2.debug('message', 7);
log2.info('message', 8);
log2.warn('message', 9);
log2.danger('message', 10);
log2.error('message', 11);
log2.fatal('message', 12);

console.log('----------');

log1.debug('message', 13);
log1.info('message', 14);
log1.warn('message', 15);
log1.danger('message', 16);
log1.error('message', 17);
log1.fatal('message', 18);
