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
   * Log levels. Each level is a log method.
   * @type {Array}
   */
  const levels = [
    {
      name: 'DEBUG',
      scale: 4,
      method: 'debug',
      'console': 'debug'
    },
    {
      name: 'INFO',
      scale: 3,
      method: 'info',
      'console': 'info'
    },
    {
      name: 'WARN',
      scale: 2,
      method: 'warn',
      'console': 'warn'
    },
    {
      name: 'ERROR',
      scale: 1,
      method: 'error',
      'console': 'error'
    }
  ];

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
    history: true,  // Keep a record of all messages.
    scale: 4,  // Scale to display messages.
    throwErrors: false,  // Throw errors in methods scale 1 or below.
    display: true,  // Display messages in console.
    displayTime: false,  // Display the time in messages.
    displayLevel: true,  // Display the level in messages.
    displayNamespace: true  // Display the namespace in messages.
  };

  /**
   * Add a new method level.
   * @param {Object} level - Level description.
   * @param {String} level.name - Level name.
   * @param {Number} [level.scale] - Number scale. Default to 0.
   * @param {String} [level.method] - The method logger. Default to 'log'.
   * @param {String} [level.console] - The console method used to display. Default 'log'.
   */
  Log.addLevel = function (level) {

    if (!level || typeof level !== 'object') {
      throw new Error('The first parameter must be an object describing the level');
    }
    if (typeof level.name !== 'string') {
      throw new Error('The level object must have a name property');
    }

    level = extend({
      name: null,
      scale: 0,
      method: 'log',
      'console': 'log'
    }, level);

    this.prototype[level.method] = function () {
      this._exec(level, arguments);
    };
  };

  /**
   * Record a log in logger history if configured.
   * @private
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
   * @private
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
      var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      var ms = date.getMilliseconds() < 10 ?
        '00' + date.getMilliseconds() :
        date.getMilliseconds() < 100 ?
          '0' + date.getMilliseconds() :
          date.getMilliseconds();
      dtime = hh + ':' + mm + ':' + ss + '.' + ms + ' ';
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
   * @private
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} msg - The parsed message.
   */
  Log.prototype._log = function (level, msg) {
    if (this.settings.display) {
      if (console && console.log) {
        if (console[level.console] && typeof console[level.console] === 'function') {
          console[level.console](msg);
        } else {
          console.log(msg);
        }
      }
    }
  };

  /**
   * Log method definition.
   * @private
   * @param  {Object} level - Reference to the level definition.
   * @param  {Array} args - The arguments received by the log method.
   */
  Log.prototype._exec = function (level, args) {

    var date = new Date();
    var text = '';

    args = Array.prototype.slice.call(args, 0);
    for (var i=0; i<args.length; i++) {
      if (typeof args[i] === 'object') {
        text += ' '+ JSON.stringify(args[i]);
      } else {
        text += ' '+ args[i];
      }
    }
    text = text.trim();

    var msg = this._msg(date, level, text);

    this._record(date, level, text, msg);

    if (this.settings.throwErrors && level.scale <= 1) {
      throw new Error(msg);
    }

    if (level.scale <= this.settings.scale) {
      this._log(level, msg);
    }
  };

  // Initialize default levels.
  for (var l=0; l<levels.length; l++) {
    Log.addLevel(levels[l]);
  }

  return Log;
}));
