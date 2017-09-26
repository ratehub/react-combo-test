# Changes

## v0.4.1

_2017-09-26_

### Enhancements

  - Better error reporting for invalid component types passed to the main `comboTest` function.


## v0.4.0

_2017-08-15_

### Breaking

  - The main function signature changed from `check(Component, options)` to `check(Component, props, options)`. Props used to be a key of `options`, but they are now their own argument to reflect their importance (not to mention they are always mandatory, unlike all other options).
