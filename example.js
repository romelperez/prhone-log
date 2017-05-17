var Log = require('./lib');

Log.addLevel({
  name: 'awesome',
  priority: 2,
  color: Log.COLORS.MAGENTA
});

var log1 = new Log('myapp1');

var log2 = new Log('myapp2', {
  displayTime: false,
  priority: 1,
});

log1.debug('message', 1);
log1.info('message', 2);
log1.warn('message', 3);
log1.error('message', 4);
log1.awesome('message', 5);

log2.debug('message', 1);
log2.info('message', 2, { name: 'second', type: 'information' });
log2.warn('message', 3);
log2.error('message', 4);
log2.awesome('message', 5);

console.log(log2.getHistory());
