(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["prhone-log"], function () {
      return factory();
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.prhone = root.prhone || {};
    root.prhone.Log = factory();
  }
}(this, function () {

  var NODE_COLOR_END = '\x1b[0m';
  var BROWSER_COLOR_END = 'color:auto;';

  /**
   * Simple extend object. Receives many objects.
   * @private
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
   * Is this node.js?
   * @private
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
   * Format a time number.
   * @private
   * @param  {Number} time
   * @param  {Number} n - Number of digits to show. Default 2.
   * @return {String}
   */
  var formatTime = function (time, n) {
    time = Number(time) || 0;
    n = n || 2;

    if (n === 2) {
      time = time < 10 ? time + '0' : time;
    } else if (n === 3) {
      time = time < 10
        ? time + '00'
        : time < 100
          ? time + '0'
          : time;
    }

    return String(time);
  };

  /**
   * The logger class.
   * @param {String} namespace - A namespace to identify the logger.
   * @param {Object} [settings] - An optional configuration to extend defaults.
   */
  var Log = function (namespace, settings) {

    if (typeof namespace !== 'string' || !namespace.trim().length) {
      throw new Error('A valid string namespace is required as first parameter.');
    }

    this.namespace = namespace.trim();
    this.settings = extend({}, Log.settings, settings);
    this.history = [];
    this.levels = {};
  };

  /**
   * Colors.
   * @type {Object}
   */
  Log.COLORS = {
    RED: {
      node: '\x1b[31m',
      browser: 'color:#c62828;',
    },
    GREEN: {
      node: '\x1b[32m',
      browser: 'color:#2E7D32;',
    },
    YELLOW: {
      node: '\x1b[33m',
      browser: 'color:#F9A825;',
    },
    BLUE: {
      node: '\x1b[34m',
      browser: 'color:#1565C0;',
    },
    MAGENTA: {
      node: '\x1b[35m',
      browser: 'color:#AD1457;',
    },
    CYAN: {
      node: '\x1b[36m',
      browser: 'color:#00838F;',
    },
    BLACK: {
      node: '\x1b[30m',
      browser: 'color:#111111;',
    },
    WHITE: {
      node: '\x1b[37m',
      browser: 'color:#eeeeee;',
    },
  };

  /**
   * Default settings.
   * @type {Object}
   */
  Log.settings = {
    history: true,  // Keep a record of all messages.
    priority: 3,  // Priority of messages to display.
    colors: true,  // Enable colors on display.
    throwErrors: false,  // Throw errors in methods priority 0 or below.
    display: true,  // Display messages in console.
    displayTime: true,  // Display the time in messages.
    displayLevel: true,  // Display the level in messages.
    displayNamespace: true,  // Display the namespace in messages.
  };

  /**
   * All registered levels.
   * @type {Object}
   */
  Log.levels = {};

  /**
   * Add a new method level.
   * @param {Object} level - Level description.
   * @param {String} level.name - Level name.
   * @param {Number} [level.priority] - Number priority. Default to 3.
   * @param {String} [level.color] - The console color. Default `null`.
   */
   Log.addLevel =
   Log.prototype.addLevel = function (level) {

    if (!level || typeof level !== 'object') {
      throw new Error('The first parameter must be an object describing the level.');
    }
    if (typeof level.name !== 'string' && !level.name.length) {
      throw new Error('The level object must have a name property.');
    }

    level = extend({
      name: null,
      priority: 3,
      color: null
    }, level);

    this.levels[level.name] = level;

    var proto = this.prototype ? this.prototype : this;
    proto[level.name] = function () {
      this._execute(level, arguments);
    };
  };

  /**
   * Set an specific priority of messages to display.
   * @param {Number|Object} priority - Priority number.
   */
  Log.setPriority =
  Log.prototype.setPriority = function (priority) {
    if (typeof priority === 'number') {
      this.settings.priority = priority;
    } else {
      throw new Error('First parameter must be a priority number.');
    }
  };

  /**
   * Record a log in logger history if configured.
   * @private
   * @param  {Date} date - Date of log.
   * @param  {Object} level - Reference to the level definition.
   * @param  {String} text - The raw message.
   * @param  {Object} [meta] - Metadata.
   */
  Log.prototype._record = function (date, level, text, meta) {
    if (this.settings.history) {
      this.history.push({
        date: date.getTime(),
        level: level.name,
        text: text,
        meta: meta
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
  Log.prototype._prefix = function (date, level) {

    var dtime = '';
    var dlevel = '';
    var dnamespace = '';

    if (this.settings.displayTime) {
      var hh = formatTime(date.getHours());
      var mm = formatTime(date.getMinutes());
      var ss = formatTime(date.getSeconds());
      var ms = formatTime(date.getMilliseconds(), 3);
      dtime = hh + ':' + mm + ':' + ss + '.' + ms + ' ';
    }

    if (this.settings.displayLevel) {
      dlevel = level.name.toUpperCase() +' ';
    }

    if (this.settings.displayNamespace) {
      dnamespace = '['+ this.namespace +'] ';
    }

    var dmsg = (dtime + dlevel + dnamespace).trim();
    dmsg = dmsg.length ? (dmsg + ':') : '';

    return dmsg;
  };

  /**
   * Log the message in the console.
   * @private
   * @param  {Array} msgParts - Array of strings to log.
   */
  Log.prototype._log = function (msgParts) {
    if (this.settings.display) {
      if (console && console.log) {
        console.log.apply(console.log, msgParts);
      }
    }
  };

  /**
   * Log method definition.
   * @private
   * @param  {Object} level - Reference to the level definition.
   * @param  {Array} args - The arguments received by the log method.
   */
  Log.prototype._execute = function (level, args) {

    var date = new Date();
    var text = '';
    var meta = void 0;

    args = Array.prototype.slice.call(args, 0);
    for (var i=0; i<args.length; i++) {
      if (i === args.length - 1 && typeof args[i] === 'object') {
        meta = args[i];
      } else {
        text += ' '+ args[i];
      }
    }
    text = text.trim();

    this._record(date, level, text, meta);

    if (this.settings.throwErrors && level.priority <= 0) {
      throw new Error(text);
    }

    if (level.priority <= this.settings.priority) {

      var prefix = this._prefix(date, level);
      var msgParts = [text];

      if (prefix.length) {
        if (this.settings.colors && level.color) {
          if (isNode) {
            msgParts = [level.color.node + prefix + NODE_COLOR_END +' '+ text];
          } else {
            msgParts = ['%c'+ prefix +' %c'+ text, level.color.browser, BROWSER_COLOR_END];
          }
        } else {
          msgParts = [prefix +' '+ text];
        }
      }

      this._log(msgParts);
    }
  };

  // Initial levels.
  const levels = [
    {
      name: 'debug',
      priority: 3,
    },
    {
      name: 'info',
      priority: 2,
      color: Log.COLORS.BLUE
    },
    {
      name: 'warn',
      priority: 1,
      color: Log.COLORS.YELLOW
    },
    {
      name: 'error',
      priority: 0,
      color: Log.COLORS.RED
    }
  ];
  for (var l=0; l<levels.length; l++) {
    Log.addLevel(levels[l]);
  }

  return Log;
}));
