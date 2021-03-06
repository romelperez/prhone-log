const Log = require('../lib');

const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

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
        const method = methods.filter(m => m.name === item.name)[0];
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

    it('Logger creates history', function () {
      const logger = new Log('app');
      const history = logger.getHistory();
      expect(history).to.be.an('array').to.have.length(0);
    });

    it('When logging, logs are registered by default', function () {
      const batch = makeBatch();
      const logger = new Log('app');

      batch.forEach(({ name, msg }) => logger[name](msg));

      const history = logger.getHistory();
      expect(history).to.be.an('array').to.have.length(batch.length);

      batch.forEach(({ name, msg }, index) => {
        const item = history[index];
        expect(item).to.be.an('object');
        expect(item).to.have.property('level', name);
        expect(item).to.have.property('text', msg);
        expect(item).to.have.property('date').to.be.a('number');
      });
    });

    it('Logs are registered with meta data', function () {
      const logger = new Log('app');
      const meta = { a: 1, b: true };
      logger.debug('a message', meta);

      const history = logger.getHistory();
      const item = history[0];
      expect(item).to.have.property('meta');
      expect(item.meta).to.eql(meta);
    });

    it('Logs with non-valid meta data do not save it', function () {
      const logger = new Log('app');
      logger.debug('message', null);
      logger.debug('message', function () {});
      const history = logger.getHistory();
      history.forEach((item, index) => {
        expect(item).to.not.have.property('meta');
      });
    });

    it('Logs are not registered when history option is disabled', function () {
      const batch = makeBatch();
      const logger = new Log('app', { history: false });

      batch.forEach(({ name, msg }) => logger[name](msg));

      const history = logger.getHistory();
      expect(history).to.be.an('array').to.have.length(0);
    });

    it('History is a copy of real history', function () {
      const batch = makeBatch();
      const logger = new Log('app', { history: false });

      batch.forEach(({ name, msg }) => logger[name](msg));

      const history1 = logger.getHistory();
      const history2 = logger.getHistory();

      expect(history1).to.not.equal(history2);
      expect(history1).to.have.length(history2.length);

      history1.forEach((e, index) => {
        expect(history1[index], 'Items should not be equal').to.not.equal(history2[index]);
      });
    });
  });

  describe('Display', function () {

    it('Disabled display should not show any log', function () {
      const logger = new Log('app', { display: false });
      logger.debug('This is an example');
      expect(console.log.called).to.be.false;
    });

    it('Disabled display namespace should not show namespace', function () {
      const ns = 'mynamespace';
      const logger = new Log(ns, { displayNamespace: false });
      logger.debug('This is an example');
      expect(console.log.calledWithMatch(ns)).to.be.false;
    });

    it('Disabled display time should not show time', function () {
      const logger = new Log('app', { displayTime: false });
      logger.debug('a message');
      expect(console.log.calledWithMatch(/\d\d\:\d\d\:\d\d\.\d\d\d/)).to.be.false;
    });

    it('Disabled display level (method) should not show level', function () {
      const logger = new Log('app', { displayLevel: false });
      logger.debug('a message');
      expect(console.log.calledWithMatch('DEBUG')).to.be.false;
    });

    it('Default log should display time, name (uppercase), namespace (in brackets) and message', function () {
      const ns = 'mynamespace';
      const method = 'debug';
      const msg = 'A normal message';
      const logger = new Log(ns);

      logger[method](msg);
      expect(console.log.calledWithMatch(/\d\d\:\d\d\:\d\d\.\d\d\d/), 'Proper time').to.be.true;
      expect(console.log.calledWithMatch(method.toUpperCase()), 'Proper method name').to.be.true;
      expect(console.log.calledWithMatch(`[${ns}]`), 'Proper namespace').to.be.true;
      expect(console.log.calledWithMatch(msg), 'Proper message').to.be.true;
    });
  });

  describe('Colors', function () {

    it('Color is logged properly in browser and node.js', function () {
      const logger = new Log('app');
      logger.info('message');

      if (isBrowser()) {
        expect(console.log.calledWithMatch(
          /\%c\d\d\:\d\d\:\d\d\.\d\d\d INFO \[app\] \%cmessage/,
          'color:#1565C0;',
          'color:auto;'
        )).to.be.true;
      }
      else {
        expect(console.log.calledWithMatch(
          /\x1b\[34m\d\d\:\d\d\:\d\d\.\d\d\d INFO \[app\]\x1b\[0m message/
        )).to.be.true;
      }
    });

    it('New logger with custom color is logged properly', function () {
      const logger = new Log('app');
      logger.addLevel({
        name: 'love',
        color: {
          node: '\x1b[31m',
          browser: 'color:#c62828;',
        },
      });
      logger.love('message');

      if (isBrowser()) {
        expect(console.log.calledWithMatch(
          /\%c\d\d\:\d\d\:\d\d\.\d\d\d LOVE \[app\] \%cmessage/,
          'color:#c62828;',
          'color:auto;'
        )).to.be.true;
      }
      else {
        expect(console.log.calledWithMatch(
          /\x1b\[31m\d\d\:\d\d\:\d\d\.\d\d\d LOVE \[app\]\x1b\[0m message/
        )).to.be.true;
      }
    });

    it('Disabled color should log message without wrappers', function () {
      const logger = new Log('app', { colors: false });
      logger.info('message');
      expect(console.log.calledWithMatch(
        /\d\d\:\d\d\:\d\d\.\d\d\d INFO \[app\] message/
      )).to.be.true;
    });
  });

});
