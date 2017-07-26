const test = require('tape');
const unpatch = require('../patchTypeSpec');
const React = require('react');
const PropTypes = require('prop-types');
const Renderer = require('react-test-renderer');
const silenceReactWarnings = require('../silenceReactWarnings');

const Component = ({ children }) => children;
Component.propTypes = {
  x: PropTypes.number.isRequired,
};


test('typeSpec is patched', assert => {
  assert.plan(2);

  assert.throws(() =>
    React.createElement(Component));

  const jsx = React.createElement(Component, { x: 1 },
    React.createElement(() => React.createElement(Component)));

  assert.throws(() => {
    Renderer.create(jsx);
  });
});


test('patching can be un- and re-patched', assert => {
  assert.plan(4);

  const patch = unpatch();
  assert.false(unpatch.isPatched());

  silenceReactWarnings(() =>
    assert.doesNotThrow(() =>
      React.createElement(Component)));

  patch();
  assert.true(unpatch.isPatched());

  assert.throws(() =>
    React.createElement(Component));
});

