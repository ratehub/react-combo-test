const Module = require('module');
const original = require('react/lib/checkReactTypeSpec');
const assertPropTypes = require('check-prop-types').assertPropTypes;

let isPatched = false;

function wrapped(specs, values, location, componentName, element, debugId) {
  return isPatched
    ? assertPropTypes(specs, values, location, componentName)
    : original(specs, values, location, componentName, element, debugId);
}

Module.prototype.require = function patchedRequire(path) {
  if (path.endsWith('/checkReactTypeSpec') ||
      path.endsWith('/checkReactTypeSpec.js')) {
    return wrapped;
  }
  return Module._load(path, this);  // eslint-disable-line no-underscore-dangle
}

function patch() {
  isPatched = true;
  return unpatch;
}

function unpatch() {
  isPatched = false;
  return patch;
}

patch.isPatched = unpatch.isPatched = function() {
  return isPatched;
};

module.exports = patch();
