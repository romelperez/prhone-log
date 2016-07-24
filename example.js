var Log = require('./lib');

Log.addLevel({
  name: 'COMPLETE',
  scale: 3,
  method: 'complete',
  console: 'log',
  color: Log.COLOR.GREEN
});

Log.addLevel({
  name: 'DANGER',
  scale: 2,
  method: 'danger',
  console: 'warn',
  color: Log.COLOR.YELLOW
});

Log.addLevel({
  name: 'FATAL',
  scale: 0,
  method: 'fatal',
  console: 'error',
  color: Log.COLOR.RED
});

var log1 = new Log('app1', {
  scale: 1,
  displayTime: true
});

var log2 = new Log('app2', {
  scale: 3,
  displayTime: true
});

console.log('----------');

log1.debug('message', 1);
log1.info('message', 2);
log1.complete('message', 2);
log1.warn('message', 3);
log1.danger('message', 5);
log1.error('message', 6);  // displayed
log1.fatal('message', 7);  // displayed

console.log('----------');

log2.debug('message', 8);
log2.info('message', 9);  // displayed
log2.complete('message', 10);  // displayed
log2.warn('message', 11);  // displayed
log2.danger('message', 12);  // displayed
log2.error('message', 13);  // displayed
log2.fatal('message', 14);  // displayed

console.log('----------');

log1.setLevel(2);

log1.debug('message', 15);
log1.info('message', 16);
log1.complete('message', 17);
log1.warn('message', 18);  // displayed
log1.danger('message', 19);  // displayed
log1.error('message', 20);  // displayed
log1.fatal('message', 21);  // displayed

console.log('----------');

log1.setLevel(Log.LEVEL.DEBUG);

log1.debug('message', 22);  // displayed
log1.info('message', 23);  // displayed
log1.complete('message', 24);  // displayed
log1.warn('message', 25);  // displayed
log1.danger('message', 26);  // displayed
log1.error('message', 27);  // displayed
log1.fatal('message', 28);  // displayed

console.log('----------');
