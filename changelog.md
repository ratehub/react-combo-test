# Changes

## v0.4.0

_2017-08-15_

### Breaking

  - The main function signature changed from `check(Component, options)` to `check(Component, props, options)`. Props used to be a key of `options`, but they are now their own argument to reflect their importance (not to mention they are always mandatory, unlike all other options).
