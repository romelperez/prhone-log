const { expect } = require('chai');
const sinon = require('sinon');
const Log = require('../lib');

function makeMethodTest (name) {
  it(`Log ${name} messages`, function () {
    const msg1 = `A ${name} message 1`;
    const msg2 = `A ${name} message 2`;
    const logger = new Log('app');

    expect(console.log.callCount).to.equal(0);

    logger[name](msg1);
    expect(console.log.callCount).to.equal(1);
    expect(console.log.calledWithMatch(msg1)).to.be.true;

    logger[name](msg2);
    expect(console.log.callCount).to.equal(2);
    expect(console.log.calledWithMatch(msg2)).to.be.true;
  });
}

function makeLogMethods () {
  return [
    { name: 'debug', priority: 3 },
    { name: 'info', priority: 2 },
    { name: 'warn', priority: 1 },
    { name: 'error', priority: 0 }
  ];
}

function makeBatch () {
  return [
    { name: 'debug', msg: 'A debug message 1' },
    { name: 'info', msg: 'An information message 1' },
    { name: 'error', msg: 'An error message 1' },
    { name: 'warn', msg: 'A warning message 1' },
    { name: 'debug', msg: 'A debug message 2' },
    { name: 'info', msg: 'An information message 2' },
    { name: 'error', msg: 'An error message 2' }
  ];
}

describe('Logging', function () {

  beforeEach(function () {
    sinon.spy(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  describe('Messages', function () {

    makeMethodTest('debug');

    makeMethodTest('info');

    makeMethodTest('warn');

    makeMethodTest('error');

    it('Prop throwErrors should throw errors on priority 0', function () {
      const logger = new Log('app', { throwErrors: true });
      expect(function () {
        logger.error('an error');
      }).to.throw();
    });

    it('Provided parameters should be logged as strings', function () {
      const logger = new Log('app');
      logger.debug('a b c', true, -154.47);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWithMatch('a b c true -154.47')).to.be.true;
    });

    it('Last parameter is not logged when it is an object', function () {
      const logger = new Log('app');
      logger.debug('something here', { meta: true });
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWithMatch(/something\shere$/)).to.be.true;
    });
  });

  describe('Priorities', function () {

    it('Total quantity of logs are equal to allowed displayed logs', function () {
      const priority = 1;
      const logger = new Log('app', { priority });
      const batch = makeBatch();
      const methods = makeLogMethods();

      batch.forEach(item => logger[item.name](item.msg));

      const logs = methods.reduce((total, method) => {
        const msgs = batch.filter(i => i.name === method.name);
        return total + (method.priority <= priority ? msgs.length : 0);
      }, 0);
      expect(console.log.callCount).to.equal(logs);
    });

    it('Only loggers equal or below priority are logged', function () {
      const priority = 1;
      const logger = new Log('app', { priority });
      const batch = makeBatch();
      const methods = makeLogMethods();

      batch.forEach(item => logger[item.name](item.msg));

      let count = 0;
      batch.forEach(item => {
        const call = console.log.getCall(count);
        const method = methods.find(m => m.name === item.name);
        if (method.priority <= priority) {
          expect(call.args[0], 'expected log message').to.contain(item.msg);
          count++;
        }
        else {
          expect(call.args[0], 'unexpected log message').to.not.contain(item.msg);
        }
      });
    });
  });

  describe('getSettings() and update()', function () {

    it('Get settings', function () {
      const logger = new Log('app');
      const settings = logger.getSettings();
      expect(settings).to.be.an('object');
    });

    it('Settings is a copy', function () {
      const logger = new Log('app');
      const settings1 = logger.getSettings();
      const settings2 = logger.getSettings();
      expect(settings1).to.not.equal(settings2);
    });

    it('Update global logger', function () {
      const logger = new Log('app');

      const settings1 = logger.getSettings();
      expect(settings1, 'Initial colors is true').to.have.property('colors', true);
      expect(settings1, 'Initial display is true').to.have.property('display', true);

      logger.update({ colors: false });

      const settings2 = logger.getSettings();
      expect(settings2, 'Final colors is false').to.have.property('colors', false);
      expect(settings2, 'Final display is true').to.have.property('display', true);
    });
  });

  describe('addLevel()', function () {

    it('Method throws if not passed a valid object (1)', function () {
      expect(function () {
        const logger = new Log('app');
        logger.addLevel();
      }).to.throw();
    });

    it('Method throws if not passed a valid object (2)', function () {
      expect(function () {
        const logger = new Log('app');
        logger.addLevel({ asd: true });
      }).to.throw();
    });

    it('Method throws if not passed a valid object (3)', function () {
      expect(function () {
        const logger = new Log('app');
        logger.addLevel({ name: '' });
      }).to.throw();
    });

    it('Method creates a new logger method', function () {
      const logger = new Log('app');
      expect(logger.crazylog).to.be.undefined;

      logger.addLevel({ name: 'crazylog', });
      expect(logger.crazylog).to.be.a('function');
    });

    it('Method adds a new logger', function () {
      const logger = new Log('app');
      const text = 'something is great going on here!';

      logger.addLevel({ name: 'crazylog', });
      expect(console.log.calledOnce).to.be.false;

      logger.crazylog(text);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWithMatch(text)).to.be.true;
    });
  });

  describe('History and getHistory()', function () {
    // TODO:
  });

  describe('Colors', function () {
    // TODO:
  });

});
