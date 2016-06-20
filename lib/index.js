(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["prhone-log"], function () {
      return factory();
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrhoneLog = factory();
  }
}(this, function () {

  /**
   * Simple extend object. Receives many objects.
   * @param  {Object} obj - The object to extend.
   * @return {Object} - `obj` extended.
   */
  var extend = function (obj) {
    obj = obj || {};
    var exts = Array.prototype.slice.call(arguments, 1);
    for (var k=0; k<exts.length; k++) {
      for (var i in exts[k]) {
        if (exts[k].hasOwnProperty(i)) {
          obj[i] = exts[k][i];
        }
      }
    }
    return obj;
  };

  /**
   * The logger class.
   * @param {String} namespace - A namespace to identify the logger.
   * @param {Object} [settings] - An optional configuration to overwrite defaults.
   */
  var Log = function (namespace, settings) {
    this.namespace = namespace;
    this.history = [];
    this.settings = extend({}, Log.defaults, settings);
  };

  /**
   * Default config.
   * @type {Object}
   */
  Log.defaults = {
    history: true,
    production: false,
    throwErrors: false,
    displayTime: false,
    displayLevel: true,
    displayNamespace: true
  };

  /**
   * Log levels. Each level is a log method.
   * @type {Object}
   */
  Log.LEVEL = {
    DEBUG: {
      name: 'DEBUG',
      method: 'debug'
    },
    INFO: {
      name: 'INFO',
      method: 'info'
    },
    WARN: {
      name: 'WARN',
      method: 'warn'
    },
    ERROR: {
      name: 'ERROR',
      method: 'error'
    }
  };

  /**
   * Record a log in logger history if configured.
   * @access private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} text - The raw message.
   * @param  {String} msg - The parsed message.
   */
  Log.prototype._record = function (date, level, text, msg) {
    if (this.settings.history) {
      this.history.push({
        date: date.getTime(),
        level: level,
        text: text,
        msg: msg
      });
    }
  };

  /**
   * Create the log message with the logger configuration.
   * @access private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} text - The raw message.
   * @return {String} - The parsed message.
   */
  Log.prototype._msg = function (date, level, text) {

    var dtime = '';
    var dlevel = '';
    var dnamespace = '';

    if (this.settings.displayTime) {
      var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      var ms = date.getMilliseconds() < 10 ?
        '00' + date.getMilliseconds() :
        date.getMilliseconds() < 100 ?
          '0' + date.getMilliseconds() :
          date.getMilliseconds();
      dtime = hh + ':' + ss + '.' + ms + ' ';
    }

    if (this.settings.displayLevel) {
      dlevel = level.name + ' ';
    }

    if (this.settings.displayNamespace) {
      dnamespace = this.namespace + ' ';
    }

    var dmsg = (dtime + dlevel + dnamespace).trim();
    dmsg = dmsg.length ? dmsg + ': ' + text : text;

    return dmsg;
  };

  /**
   * Log the message in the console.
   * @access private
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} msg - The parsed message.
   */
  Log.prototype._log = function (level, msg) {
    if (console && console.log) {
      if (console[level.method] && typeof console[level.method] === 'function') {
        console[level.method](msg);
      } else {
        console.log(msg);
      }
    }
  };

  /**
   * Log method definition.
   * @access private
   * @param  {Object} level - Reference to the level definition.
   * @param  {Array} args - The arguments received by the log method.
   */
  Log.prototype._exec = function (level, args) {

    var date = new Date();
    var text = String(args[0]);
    var msg = this._msg(date, level, text);

    this._record(date, level, text, msg);

    if (this.settings.throwErrors && level === Log.LEVEL.ERROR) {
      throw new Error(msg);
    }

    if (level === Log.LEVEL.ERROR || !this.settings.production) {
      this._log(level, msg);
    }
  };

  /**
   * Debug logger.
   */
  Log.prototype[Log.LEVEL.DEBUG.method] = function () {
    this._exec(Log.LEVEL.DEBUG, arguments);
  };

  /**
  * Information logger.
  */
  Log.prototype[Log.LEVEL.INFO.method] = function () {
    this._exec(Log.LEVEL.INFO, arguments);
  };

  /**
  * Warning logger.
  */
  Log.prototype[Log.LEVEL.WARN.method] = function () {
    this._exec(Log.LEVEL.WARN, arguments);
  };

  /**
  * Error logger.
  */
  Log.prototype[Log.LEVEL.ERROR.method] = function () {
    this._exec(Log.LEVEL.ERROR, arguments);
  };

  return Log;
}));
