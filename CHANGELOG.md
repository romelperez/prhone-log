# CHANGELOG

## v3.0.0 / 2017-05-16

- Class `LEVEL` property has been removed. Use priority numbers instead.
- Class `COLOR` property has been renamed `COLORS` with a new color definition.
- Class `defaults` method has been removed. Now is accessible via `getSettings()` and modified via method `update()`.
- Global new loggers are added via class method `addLevel()` and instance loggers are added via `addLevel()`, both use a new way to define them. See docs.
- Removed `history` property in log instances. Now is accessible via `getHistory()` method.
- History items have a different definition, see docs.
- Removed `settings` property in log instances. Now is accessible via `getSettings()` method and modified via `update()` method.
- Removed `setLevel()` method. Use `update()` with the new `priority` instead.
- Logger configuración property `scale` has been renamed `priority`.
- Objects are not converted with `JSON.stringify()` method, they are converted to strings directly. Functions are ignored. If the last parameter is an object or array, it is saved as metadata in logger history.
- Now all loggers use `console.log` both in browser and node.js.
- In browser built is now used as `window.prhone.Log` instead of `window.PrhoneLog`.
- Added support for colors in browser.

## v2.2.0 / 2016-07-23

- The namespaces are enclosed in brakets.
- The colors in Node.js only apply until the namespace.

## v2.1.0 / 2016-07-05

- Added `Log.LEVEL` object
- Added `Log.setLevel` method
- Added support for colors
- Fix `Log.addLevel` validation of input
- Fix initialization class validation of input

## v2.0.0 / 2016-06-22

- Remove `production` configuration
- Added `scale` configuration
- Added global method to add new level methods
- Added `display` configuration
- Enabling multiple parameters as immutable values or objects in logger methods
- Fixed time missing minutes
