const { assertPropTypes } = require('check-prop-types');

const shimmed = (specs, values, location, componentName, element, debugId) =>
  assertPropTypes(specs, values, location, componentName);
const id = require.resolve('react/lib/checkReactTypeSpec');

function patch() {
  jest.setMock(id, shimmed);  // eslint-disable-line no-undef
  return unpatch;
}

function unpatch() {
  jest.unmock(id);  // eslint-disable-line no-undef
  return patch;
}

unpatch.isPatched = true;
patch.isPatched = false;

module.exports = patch();
