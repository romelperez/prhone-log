# PRHONE Log

[![npm version](https://badge.fury.io/js/prhone-log.svg)](https://badge.fury.io/js/prhone-log)
[![Build Status](https://travis-ci.org/romelperez/prhone-log.svg?branch=master)](https://travis-ci.org/romelperez/prhone-log)

> Simple JavaScript logger.

A simple JavaScript logger aimed for client side applications but it can be used in Node.js environments.

Supports CommonJS, AMD and basic use in browser. In browser is found as `window.PrhoneLog`.

## Installation

```bash
npm install --save prhone-log
```

## Use

```js
const Log = require('prhone-log');

const logger1 = new Log('namespace1');

logger1.info('Initializing app.'); // INFO namespace1: Initializing app.
logger1.debug('Loading global configuration.'); // DEBUG namespace1: Loading global configuration.
logger1.debug('Loading user configuration.'); // DEBUG namespace1: Loading user configuration.
logger1.warn('The property "random" is not a number.'); // WARN namespace1: The property "random" is not a number.
logger1.info('Loading app.'); // INFO namespace1: Loading app.
logger1.debug('Downloading resources.'); // DEBUG namespace1: Downloading resources.
logger1.debug('Installing required libraries.'); // DEBUG namespace1: Installing required libraries.
logger1.debug('Installing plugins.'); // DEBUG namespace1: Installing plugins.
logger1.info('Rendering app.'); // INFO namespace1: Rendering app.
logger1.debug('Displaying main frames.'); // DEBUG namespace1: Displaying main frames.
logger1.debug('Animating list.'); // DEBUG namespace1: Animating list.
logger1.error('The user machine does not support WebGL.'); // ERROR namespace1: The user machine does not support WebGL.
```

## API

### `logger Log(String namespace[, Object settings])`

Creates a new logger instance.

- `String namespace` The logger namespace or logger name.
- `Object settings` Optional configuration to overwrite.
  - `Boolean history` If logger should keep an history. Default to `true`.
  - `Boolean production` If only display in console the error messages. Default to `false`.
  - `Boolean displayTime` If display the time in each message in console. Default to `false`.
  - `Boolean displayLevel` If display the level in each message in console. Default to `true`.
  - `Boolean displayNamespace` If display the namespace in each message in console. Default to `true`.
  - `Boolean throwErrors` If should throw an error on error messages. Default to `false`.

### `logger.debug(String msg)`

Logs a debug level message. A required text message is required.

### `logger.info(String msg)`

Logs an informative level message. A required text message is required.

### `logger.warn(String msg)`

Logs a warning level message. A required text message is required.

### `logger.error(String msg)`

Logs an error level message. A required text message is required.

### `Array logger.history`

This is an array with all messages recorded in order chronological, whether logged in console or not.

### `Object logger.settings`

The settings used for the logger.

### `Object Log.defaults`

The default configuration. This can be overwritten and will be used as default global configuration.

## License

[MIT](./LICENSE)
