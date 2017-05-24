# PRHONE Log

[![npm version](https://badge.fury.io/js/prhone-log.svg)](https://badge.fury.io/js/prhone-log)
[![Build Status](https://travis-ci.org/romelperez/prhone-log.svg?branch=master)](https://travis-ci.org/romelperez/prhone-log)
[![prhone](https://img.shields.io/badge/prhone-project-1b38a9.svg)](http://romelperez.com)

> Simple JavaScript logger.

A simple JavaScript logger for client side applications but it can be used in other environments. Supports [CommonJS](http://www.commonjs.org), [AMD](https://github.com/amdjs/amdjs-api) and standalone.

See [example.html](https://github.com/romelperez/prhone-log/blob/master/example.html) and [example.js](https://github.com/romelperez/prhone-log/blob/master/example.js) for browser and node.js usage respectively.

## Install

Webpack, Browserify and Node.js:

```bash
npm install prhone-log
```

NPM CDN:

```html
<script src="https://unpkg.com/prhone-log"></script>
```

In browser it is found as `window.prhone.Log`.

## Use

```js
const Log = require('prhone-log');

const log1 = new Log('app1');

log1.info('Initializing app');
log1.debug('Loading global configuration');
log1.debug('Loading user configuration');
```

...will output:

```text
18:31:55.987 INFO [app1] Initializing app
18:31:55.987 DEBUG [app1] Loading global configuration
18:31:55.988 DEBUG [app1] Loading user configuration
```

## API


### **`Log`**

#### **`logger Log(String namespace[, Object settings])`**

Creates a new logger instance.

- `String namespace` - The logger namespace or logger name.
- `Object settings` - Optional configuration to overwrite.
  - `Number priority` - Levels priority to display. Default to `3`. This can be used to display only messages equal or below than certain priority. (ex: `priority: 1` will only display warning and error messages.)
  - `Boolean display` - Display messages on console. Default to `true`.
  - `Boolean displayTime` - Display time (hh:mm:ss.SSS). Default to `true`.
  - `Boolean displayLevel` - Display level name. Default to `true`.
  - `Boolean displayNamespace` - Display namespace. Default to `true`.
  - `Boolean throwErrors` - Throw errors on levels priority equal to 0. Default to `false`.
  - `Boolean history` - Keep history. Default to `true`.
  - `Boolean colors` - Display messages with colors. Default to `true`.

| Level | Priority |
| :---- | :------- |
| error | 0        |
| warn  | 1        |
| info  | 2        |
| debug | 3        |

#### **`Object Log.COLORS`**

List of colors to set up levels. Available colors: `RED`, `GREEN`, `YELLOW`, `BLUE`, `MAGENTA`, `CYAN`, `BLACK` and `WHITE`.

#### **`Object Log.getSettings()`**

Get a copy of the current global settings.

#### **`Log.update(Object settingsToUpdate)`**

Update the current global settings.

#### **`Log.addLevel(Object level)`**

Adds a new log level globally.

- `Object level` - Level configuration.
  - `String level.name` - Level name.
  - `Number [level.priority]` - Priority value. Default to `3`.
  - `Object [level.color]` - The log color definition. You can use the `Log.COLORS` references. Default `null`.
    - `String browser` - Browser styles. Ex: `color:#2E7D32;`
    - `String node` - Node.js color. Ex: `\x1b[32m`.

Example:

```js
const Log = require('prhone-log');

Log.addLevel({
  name: 'fatal',
  priority: 0,
  color: Log.COLORS.RED
});

const log2 = new Log('app2');

const errMsg = 'settings file is corrupt';

log2.fatal('The application crashed, details:', errMsg);
// 20:02:50.753 FATAL [app2] The application crashed, details: settings file is corrupt
```


### **`logger`**

#### **`logger.<<method>>(...parameters [, Object meta])`**

Call a log level method, be it built in (`debug`, `info`, `warn`, `error`) or custom with parameters with any type (except functions). If the last parameter is an object or array it will be saved as metadata in history.

```js
const logger = new Log('app1');
logger.info('This is a warning', { details: 'here the details' });
// 18:20:15.985 INFO [app1] This is a warning
```

#### **`Array logger.getHistory()`**

This is an array with all messages recorded in order chronological, whether logged in console or not. Only if the setting `history` is enabled.

The format of each message is:

`{`

- `date`: The datetime in number format.
- `level`: The string level name.
- `text`: The parsed text message.
- `meta`: The metadata if provided.

`}`

#### **`Object logger.getSettings()`**

Get a copy of the current logger settings.

#### **`logger.update(Object settingsToUpdate)`**

Update the current logger settings.

#### **`logger.addLevel(Object level)`**

Works the same way as `Log.addLevel()` method, but adds the level only to this logger.


## Changelog

Read [CHANGELOG.md](https://github.com/romelperez/prhone-log/blob/master/CHANGELOG.md) file to see changes.

## License

[MIT](https://github.com/romelperez/prhone-log/blob/master/LICENSE)
