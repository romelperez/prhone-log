# PRHONE Log

[![npm version](https://badge.fury.io/js/prhone-log.svg)](https://badge.fury.io/js/prhone-log)
[![Build Status](https://travis-ci.org/romelperez/prhone-log.svg?branch=master)](https://travis-ci.org/romelperez/prhone-log)
[![prhone](https://img.shields.io/badge/prhone-project-1b38a9.svg)](http://romelperez.com)

> Simple JavaScript logger.

A simple JavaScript logger aimed for client side applications but it can be used in other environments. Supports [CommonJS](http://www.commonjs.org) and [AMD](https://github.com/amdjs/amdjs-api). In browser it is found as `window.PrhoneLog`.

The idea is to be able to create different loggers under different configurations with the ability to filter what to display using scales of importance.

See [example.js](./example.js) and [example.html](./example.html) for node.js and browser usage respectively.

## Install

```bash
npm install --save prhone-log
```

## Use

```js
const Log = require('prhone-log');

const log1 = new Log('app1');

log1.info('Initializing app');
log1.debug('Loading global configuration');
log1.debug('Loading user configuration');
log1.warn('The property "random" is not a number');
log1.info('Loading app');
log1.debug('Downloading resources');
log1.debug('Installing required libraries');
log1.debug('Installing plugins');
log1.info('Rendering app');
log1.debug('Displaying main frames');
log1.debug('Animating list');
log1.error('The user machine does not support WebGL');
```

...will output this:

```
INFO [app1]: Initializing app
DEBUG [app1]: Loading global configuration
DEBUG [app1]: Loading user configuration
WARN [app1]: The property "random" is not a number
INFO [app1]: Loading app
DEBUG [app1]: Downloading resources
DEBUG [app1]: Installing required libraries
DEBUG [app1]: Installing plugins
INFO [app1]: Rendering app
DEBUG [app1]: Displaying main frames
DEBUG [app1]: Animating list
ERROR [app1]: The user machine does not support WebGL
```

## API

**`logger Log(String namespace[, Object settings])`**

Creates a new logger instance.

- `String namespace` - The logger namespace or logger name.
- `Object settings` - Optional configuration to overwrite.
  - `Number scale` - Levels scale to display. Default to `4`. This can be used to display only messages equal or below than certain scale. (ex: `scale: 2` will only display warning and error messages.)
  - `Boolean display` - Display messages on console. Default to `true`.
  - `Boolean displayTime` - Display time (hh:mm:ss.SSS). Default to `false`.
  - `Boolean displayLevel` - Display level name. Default to `true`.
  - `Boolean displayNamespace` - Display namespace. Default to `true`.
  - `Boolean throwErrors` - Throw errors on levels scale equal or below than 1. Default to `false`.
  - `Boolean history` - Keep history. Default to `true`.
  - `Boolean colors` - Display messages with colors on node.js. Default to `true`.

| Level | Scale  |
| :---- | :----- |
| DEBUG | 4      |
| INFO  | 3      |
| WARN  | 2      |
| ERROR | 1      |

**`logger.debug(parameters)`**

Logs a debug level message. Accept multiple parameters of any type.

**`logger.info(parameters)`**

Logs an informative level message. Accept multiple parameters of any type.

**`logger.warn(parameters)`**

Logs a warning level message. Accept multiple parameters of any type.

**`logger.error(parameters)`**

Logs an error level message. Accept multiple parameters of any type.

**`Array logger.history`**

This is an array with all messages recorded in order chronological, whether logged in console or not.

**`Object logger.settings`**

The settings used for the logger.

**`Object Log.LEVEL`**

All levels registered by level name. By default the four `DEBUG`, `INFO`, `WARN` and `ERROR` are registered.

**`Object Log.COLOR`**

List of colors to set up levels. Available colors: `RED`, `GREEN`, `YELLOW`, `BLUE`, `MAGENTA`, `CYAN`, `BLACK` and `WHITE`.

**`Object Log.defaults`**

The default configuration. This can be overwritten and will be used as default global configuration.

**`Log.addLevel(Object level)`**

- `Object level` - New level configuration.
  - `String level.name` - Level name.
  - `Number [level.scale]` - Number scale. Default to `0`.
  - `String [level.method]` - The method logger. Default to `log`.
  - `String [level.console]` - The console method used to display. Default `log`.

Example:

```js
const Log = require('prhone-log');

Log.addLevel({
  name: 'FATAL',
  scale: 0,
  method: 'fatal',
  console: 'error',
  color: Log.COLOR.RED
});

const log2 = new Log('app2');

const errMsg = 'settings file is corrupt';

log2.info('working properly'); // INFO [app2]: working properly
log2.fatal('The application crashed, details:', errMsg);
// FATAL [app2]: The application crashed, details: settings file is corrupt
```

**`Log.setLevel(Number|Object level)`**

Set an specific level as the scale of messages to display.

- `Number|Object level` - The number scale to set or the reference to the level object to set.

Example:

```js
const Log = require('prhone-log');

const log3 = new Log('app3');

log3.setLevel(Log.LEVEL.WARN); // is the same as: log3.setLevel(2);

log3.warn('working properly'); // WARN [app3]: working properly
log3.info('working properly'); // not displayed
log3.error('working properly'); // ERROR [app3]: working properly
```

## Changelog

Read [CHANGELOG.md](./CHANGELOG.md) file to see changes.

## License

[MIT](./LICENSE)
