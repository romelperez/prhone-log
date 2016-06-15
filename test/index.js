var chai = require('chai');
var Log = require('../lib');

var assert = chai.assert;
var loggerInterceptor = function (logger, historyLog) {

  if (!console || !console.log) return;

  const inject = function (method) {
    var log = console[method] ? console[method] : console.log;
    console[method] = function () {
      log.apply(this, Array.prototype.slice.call(arguments));
      if (!logger.__isDisabledToDebug) historyLog.push(arguments[0]);
    };
  };

  ['info', 'debug', 'warn', 'error'].forEach(function (method) {
    inject(method);
  });
};

describe('default config', function () {

  var log1 = new Log('NameSpace1');

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

describe('production environment', function () {

  var log2 = new Log('NameSpace2', {
    production: true
  });

  var logged2Msgs = [];
  loggerInterceptor(log2, logged2Msgs);

  log2.info('An information message 1');
  log2.debug('A debug message 1');
  log2.debug('A debug message 2');
  log2.info('An information message 2');
  log2.debug('A debug message 3');
  log2.warn('A warning message 1');
  log2.error('An error message 1');
  log2.warn('A warning message 2');
  log2.warn('A warning message 3');
  log2.error('An error message 2');
  log2.info('An information message 3');

  log2.__isDisabledToDebug = true;

  it('all messages should be recorded', function () {
    var msgs = [
      'INFO NameSpace2: An information message 1',
      'DEBUG NameSpace2: A debug message 1',
      'DEBUG NameSpace2: A debug message 2',
      'INFO NameSpace2: An information message 2',
      'DEBUG NameSpace2: A debug message 3',
      'WARN NameSpace2: A warning message 1',
      'ERROR NameSpace2: An error message 1',
      'WARN NameSpace2: A warning message 2',
      'WARN NameSpace2: A warning message 3',
      'ERROR NameSpace2: An error message 2',
      'INFO NameSpace2: An information message 3'
    ];
    for (var i=0; i<log2.history.length; i++) {
      assert.equal(log2.history[i].msg, msgs[i]);
    }
  });

  it('only error messages are displayed', function () {
    var msgs = [
      'ERROR NameSpace2: An error message 1',
      'ERROR NameSpace2: An error message 2'
    ];
    for (var i=0; i<msgs.length; i++) {
      assert.equal(logged2Msgs[i], msgs[i]);
    }
  });
});

describe('disabled history', function () {

  var log3 = new Log('NameSpace3', {
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
