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

  /*
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

  /*
   * Is this node.js?
   * @type {Object}
   */
  var isNode = (function () {
    var isNodejs = false;
    try {
      isNodejs = Object.prototype.toString.call(global.process) === '[object process]';
    } catch(e) {}
    return isNodejs;
  })();

  /**
   * The logger class.
   * @param {String} namespace - A namespace to identify the logger.
   * @param {Object} [settings] - An optional configuration to overwrite defaults.
   */
  var Log = function (namespace, settings) {

    if (typeof namespace !== 'string' || !namespace.length) {
      throw new Error('a valid string namespace is required as first parameter');
    }

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
    displayNamespace: true,  // Display the namespace in messages.
    colors: true  // Enable colors on display for node.js.
  };

  /**
   * All registered levels.
   * @type {Object}
   */
  Log.LEVEL = {};

  /**
   * Colors to display.
   * @type {Object}
   */
  Log.COLOR = {
    RED:      '\x1b[31m',
    GREEN:    '\x1b[32m',
    YELLOW:   '\x1b[33m',
    BLUE:     '\x1b[34m',
    MAGENTA:  '\x1b[35m',
    CYAN:     '\x1b[36m',
    BLACK:    '\x1b[30m',
    WHITE:    '\x1b[37m',
    END:      '\x1b[0m'
  };

  /**
   * Add a new method level.
   * @param {Object} level - Level description.
   * @param {String} level.name - Level name.
   * @param {Number} [level.scale] - Number scale. Default to 0.
   * @param {String} [level.method] - The method logger. Default to 'log'.
   * @param {String} [level.console] - The console method used to display. Default 'log'.
   */
   Log.addLevel = Log.prototype.addLevel = function (level) {

    if (!level || typeof level !== 'object') {
      throw new Error('The first parameter must be an object describing the level');
    }
    if (typeof level.name !== 'string' && !level.name.length) {
      throw new Error('The level object must have a name property');
    }

    level = extend({
      name: null,
      scale: 0,
      method: 'log',
      'console': 'log',
      color: false
    }, level);

    if (this.LEVEL[level.name]) {
      throw new Error('The level name "'+ level.name +'" already exists');
    }

    this.LEVEL[level.name] = level;

    this.prototype[level.method] = function () {
      this._exec(level, arguments);
    };
  };

  /**
   * Set an specific level as the scale of messages to display.
   * @param {Number|Object} level - The number scale to set or the reference to the
   * level object to set.
   */
  Log.setLevel = Log.prototype.setLevel = function (level) {
    if (typeof level === 'object' && Log.LEVEL[level.name]) {
      this.settings.scale = level.scale;
    } else {
      this.settings.scale = level;
    }
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
   * Create a log description message by logger configuration.
   * @private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @return {String} - The description.
   */
  Log.prototype._pre = function (date, level) {

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
      dlevel = level.name +' ';
    }

    if (this.settings.displayNamespace) {
      dnamespace = '['+ this.namespace +'] ';
    }

    var dmsg = (dtime + dlevel + dnamespace).trim();
    dmsg = dmsg.length ? dmsg + ':' : '';

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

    var pre = this._pre(date, level, text);
    if (pre.length && this.settings.colors && isNode) {
      pre = (level.color ? level.color : '') + pre + (level.color ? Log.COLOR.END : '');
    }

    var msg = pre.length ? pre + ' ' + text : text;

    this._record(date, level, text, msg);

    if (this.settings.throwErrors && level.scale <= 1) {
      throw new Error(msg);
    }

    if (level.scale <= this.settings.scale) {
      this._log(level, msg);
    }
  };

  // Initial levels.
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
      'console': 'info',
      color: Log.COLOR.BLUE
    },
    {
      name: 'WARN',
      scale: 2,
      method: 'warn',
      'console': 'warn',
      color: Log.COLOR.YELLOW
    },
    {
      name: 'ERROR',
      scale: 1,
      method: 'error',
      'console': 'error',
      color: Log.COLOR.RED
    }
  ];

  for (var l=0; l<levels.length; l++) {
    Log.addLevel(levels[l]);
  }

  return Log;
}));
