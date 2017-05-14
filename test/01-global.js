const { expect } = require('chai');
const sinon = require('sinon');
const Log = require('../lib');

describe('Global', function () {

  beforeEach(function () {
    sinon.spy(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  describe('Global update() and getSettings()', function () {

    it('Get settings', function () {
      const settings = Log.getSettings();
      expect(settings).to.be.an('object');
    });

    it('Settings is a copy', function () {
      const settings1 = Log.getSettings();
      const settings2 = Log.getSettings();
      expect(settings1).to.not.equal(settings2);
    });

    it('Update global logger', function () {

      const settings1 = Log.getSettings();
      expect(settings1, 'Initially colors is true').to.have.property('colors', true);
      expect(settings1, 'Initially display is true').to.have.property('display', true);

      Log.update({ colors: false });

      const settings2 = Log.getSettings();
      expect(settings2, 'Lastly colors is false').to.have.property('colors', false);
      expect(settings2, 'Lastly display is true').to.have.property('display', true);
    });
  });

  describe('Global addLevel()', function () {

    it('Method throws if not passed a valid object (1)', function () {
      expect(function () {
        Log.addLevel();
      }).to.throw();
    });

    it('Method throws if not passed a valid object (2)', function () {
      expect(function () {
        Log.addLevel({ asd: true });
      }).to.throw();
    });

    it('Method throws if not passed a valid object (3)', function () {
      expect(function () {
        Log.addLevel({ name: '' });
      }).to.throw();
    });

    it('Method creates a new method in prototype', function () {
      expect(Log.prototype.mylog).to.be.undefined;
      Log.addLevel({ name: 'mylog', });
      expect(Log.prototype.mylog).to.be.a('function');
    });

    it('Method adds a new logger', function () {
      const text = 'something is great going on here!';
      Log.addLevel({ name: 'mylog', });
      const logger = new Log('app');
      expect(console.log.calledOnce).to.be.false;
      logger.mylog(text);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWithMatch(text)).to.be.true;
    });
  });

});
