const { expect } = require('chai');
const Log = require('../lib');

describe('Base API', function () {

  it('Module is a class function', function () {
    expect(Log).to.be.a('function');
  });

  it('Class has colors constants', function () {
    expect(Log.COLORS).to.be.an('object');
  });

  it('Class has update method', function () {
    expect(Log.update).to.be.an('function');
  });

  it('Class has addLevel method', function () {
    expect(Log.addLevel).to.be.an('function');
  });

  it('No valid first parameter should throw', function () {
    expect(function () {
      new Log();
    }).to.throws();
  });

  it('Instance valid class object with namespace', function () {
    expect(new Log('ns')).to.be.an('object');
  });

  it('Instance should have an update method', function () {
    expect((new Log('app')).update).to.be.an('function');
  });

  it('Instance should have an addLevel method', function () {
    expect((new Log('app')).addLevel).to.be.an('function');
  });

  it('Instance should have a getHistory method', function () {
    expect((new Log('app')).getHistory).to.be.an('function');
  });

  it('Initial levels are set propertly', function () {
    const instance = new Log('app');
    expect(instance, 'has info method').to.have.property('info').to.be.a('function');
    expect(instance, 'has debug method').to.have.property('debug').to.be.a('function');
    expect(instance, 'has warn method').to.have.property('warn').to.be.a('function');
    expect(instance, 'has error method').to.have.property('error').to.be.a('function');
  });

});
