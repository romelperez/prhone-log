var chai = require('chai');
var Log = require('../lib');


var assert = chai.assert;
var loggerInterceptor = function (logger, historyLog) {

  if (!console || !console.log) return;

  const inject = function (method) {
    var log = console[method] ? console[method] : console.log;
    console[method] = function () {
      if (!logger.__isDisabledToDebug) historyLog.push(arguments[0]);
      //log.apply(this, Array.prototype.slice.call(arguments));
    };
  };

  // @NOTE: I don't overwrite the log method to prevent collitions.
  ['info', 'debug', 'warn', 'error'].forEach(function (method) {
    inject(method);
  });
};


describe('default config', function () {

  // Except for the colors. Later we test.
  var log1 = new Log('NameSpace1', { colors: false });

  var logged1Msgs = [];
  loggerInterceptor(log1, logged1Msgs);

  log1.info('An information message 1');
  log1.debug('A debug message 1');
  log1.debug('A debug message 2');
  log1.info('An information message 2');
  log1.debug('A debug message 3');
  log1.warn('A warning message 1');
  log1.error('An error message 1');
  log1.warn('A warning message 2');
  log1.warn('A warning message 3');
  log1.error('An error message 2');
  log1.info('An information message 3');

  log1.__isDisabledToDebug = true;

  it('the messages displayed must have the proper default format', function () {
    var msgs = [
      'INFO NameSpace1: An information message 1',
      'DEBUG NameSpace1: A debug message 1',
      'DEBUG NameSpace1: A debug message 2',
      'INFO NameSpace1: An information message 2',
      'DEBUG NameSpace1: A debug message 3',
      'WARN NameSpace1: A warning message 1',
      'ERROR NameSpace1: An error message 1',
      'WARN NameSpace1: A warning message 2',
      'WARN NameSpace1: A warning message 3',
      'ERROR NameSpace1: An error message 2',
      'INFO NameSpace1: An information message 3'
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.equal(logged1Msgs[i], msgs[i]);
    }
  });

  it('displayed messages must be the same as the recorded', function () {
    for (var i=0; i<logged1Msgs.length; i++) {
      assert.equal(logged1Msgs[i], log1.history[i].msg);
    }
  });
});


describe('scale', function () {

  var log2 = new Log('NameSpace2', {
    colors: false,
    scale: 2
  });

  var logged2Msgs = [];
  loggerInterceptor(log2, logged2Msgs);

  log2.debug('A debug message 1');
  log2.warn('A warning message 1');
  log2.info('An information message 1');
  log2.error('An error message 1');

  log2.setLevel(Log.LEVEL.INFO);

  log2.debug('A debug message 2');
  log2.warn('A warning message 2');
  log2.info('An information message 2');
  log2.error('An error message 2');

  log2.setLevel(4);

  log2.debug('A debug message 3');
  log2.warn('A warning message 3');
  log2.info('An information message 3');
  log2.error('An error message 3');

  log2.__isDisabledToDebug = true;

  it('all messages are recorded', function () {
    var msgs = [
      'DEBUG NameSpace2: A debug message 1',
      'WARN NameSpace2: A warning message 1',
      'INFO NameSpace2: An information message 1',
      'ERROR NameSpace2: An error message 1',

      'DEBUG NameSpace2: A debug message 2',
      'WARN NameSpace2: A warning message 2',
      'INFO NameSpace2: An information message 2',
      'ERROR NameSpace2: An error message 2',

      'DEBUG NameSpace2: A debug message 3',
      'WARN NameSpace2: A warning message 3',
      'INFO NameSpace2: An information message 3',
      'ERROR NameSpace2: An error message 3'
    ];
    for (var i=0; i<log2.history.length; i++) {
      assert.equal(log2.history[i].msg, msgs[i]);
    }
  });

  it('only messages of an specified and changed scale are displayed', function () {
    var msgs = [
      'WARN NameSpace2: A warning message 1',
      'ERROR NameSpace2: An error message 1',

      'WARN NameSpace2: A warning message 2',
      'INFO NameSpace2: An information message 2',
      'ERROR NameSpace2: An error message 2',

      'DEBUG NameSpace2: A debug message 3',
      'WARN NameSpace2: A warning message 3',
      'INFO NameSpace2: An information message 3',
      'ERROR NameSpace2: An error message 3'
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.equal(logged2Msgs[i], msgs[i]);
    }
  });
});


describe('disabled history', function () {

  var log3 = new Log('NameSpace3', {
    colors: false,
    history: false
  });

  var logged3Msgs = [];
  loggerInterceptor(log3, logged3Msgs);

  log3.info('An information message 1');
  log3.debug('A debug message 1');
  log3.debug('A debug message 2');
  log3.info('An information message 2');
  log3.debug('A debug message 3');
  log3.warn('A warning message 1');
  log3.error('An error message 1');
  log3.warn('A warning message 2');
  log3.warn('A warning message 3');
  log3.error('An error message 2');
  log3.info('An information message 3');

  log3.__isDisabledToDebug = true;

  it('no logs are recorded', function () {
    assert.strictEqual(log3.history.length, 0);
  });

  it('messages must be shown', function () {
    assert.strictEqual(logged3Msgs.length, 11);
  });
});


describe('enabled throwErrors', function () {

  var log4 = new Log('NameSpace4', {
    colors: false,
    throwErrors: true
  });

  it ('should throw errors when occurs', function () {
    assert.throws(function () {
      log4.warn('A warning message 1');
      log4.warn('A warning message 2');
      log4.error('An error message 1');
    }, null, 'ERROR NameSpace4: An error message 1');
  });
});


describe('add new method', function () {

  Log.addLevel({
    name: 'CUSTOM',
    scale: 2,
    method: 'custom',
    console: 'warn'
  });

  var log5 = new Log('NameSpace5', {
    colors: false
  });

  var logged5Msgs = [];
  loggerInterceptor(log5, logged5Msgs);

  log5.custom('A custom message 1');
  log5.warn('A warn message 1');
  log5.custom('A custom message 3');

  log5.__isDisabledToDebug = true;

  it('new method available along with the previous', function () {
    var msgs = [
      'CUSTOM NameSpace5: A custom message 1',
      'WARN NameSpace5: A warn message 1',
      'CUSTOM NameSpace5: A custom message 3'
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.equal(logged5Msgs[i], msgs[i]);
    }
  });
});


describe('multiples parameters', function () {

  var log6 = new Log('NameSpace6', {
    colors: false
  });

  var logged6Msgs = [];
  loggerInterceptor(log6, logged6Msgs);

  log6.info('Param1', -157.125, true, 'Param2');
  log6.custom({ a: 1, b: 'two' }, { c: true, d: [1,2,3] });

  log6.__isDisabledToDebug = true;

  it('many inmutable parameters available', function () {
    var msgs = [
      'INFO NameSpace6: Param1 -157.125 true Param2',
      'CUSTOM NameSpace6: {"a":1,"b":"two"} {"c":true,"d":[1,2,3]}'
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.equal(logged6Msgs[i], msgs[i]);
    }
  });
});


describe('disabled display', function () {

  var log7 = new Log('NameSpace7', {
    colors: false,
    display: false
  });

  var logged7Msgs = [];
  loggerInterceptor(log7, logged7Msgs);

  log7.info('Param1', -157.125, true, 'Param2');
  log7.custom('Something Great!', 'More Amazing!');

  log7.__isDisabledToDebug = true;

  it('messages are not shown', function () {
    assert.lengthOf(logged7Msgs, 0);
  });

  it('they are recorded by default', function () {
    assert.lengthOf(log7.history, 2);
  });
});


describe('customized display', function () {

  var log8 = new Log('NameSpace8', {
    colors: false,
    displayTime: true,
    displayLevel: false
  });

  var logged5Msgs = [];
  loggerInterceptor(log8, logged5Msgs);

  log8.debug('Param1', -157.125, true, 'Param2');
  log8.warn('Something Great!', 'More Amazing!');

  log8.__isDisabledToDebug = true;

  it('display time and namespace but not level', function () {
    var msgs = [
      /\d\d\:\d\d\:\d\d\.\d\d\d\sNameSpace8:\sParam1\s-157\.125\strue\sParam2/,
      /\d\d\:\d\d\:\d\d\.\d\d\d\sNameSpace8:\sSomething\sGreat!\sMore\sAmazing!/
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.match(logged5Msgs[i], msgs[i]);
    }
  });
});


describe('colors on node.js', function () {

  var log9 = new Log('NameSpace9', {
    colors: true
  });

  Log.addLevel({
    name: 'SUCCESS',
    method: 'success',
    'console': 'debug',
    color: Log.COLOR.GREEN
  });

  var logged9Msgs = [];
  loggerInterceptor(log9, logged9Msgs);

  log9.debug('no color');
  log9.info('color 1');
  log9.warn('color 2');
  log9.error('color 3');
  log9.success('color 4');

  log9.__isDisabledToDebug = true;

  it('display default colors', function () {
    var msgs = [
      'DEBUG NameSpace9: no color',
      Log.COLOR.BLUE + 'INFO NameSpace9: color 1\u001b[0m',
      Log.COLOR.YELLOW + 'WARN NameSpace9: color 2\u001b[0m',
      Log.COLOR.RED + 'ERROR NameSpace9: color 3\u001b[0m',
      Log.COLOR.GREEN + 'SUCCESS NameSpace9: color 4\u001b[0m'
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.equal(logged9Msgs[i], msgs[i]);
    }
  });
});
