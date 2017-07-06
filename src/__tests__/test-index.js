const test = require('tape');
const React = require('react');
const PropTypes = require('prop-types');
const comboTest = require('..');

const ComponentWithoutProps = () =>
  null;

const ComponentWithEmptyProps = () =>
  null;
ComponentWithEmptyProps.propTypes = {};

const ComponentWithProps = () =>
  null;
ComponentWithProps.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.string,
};

const ComponentPassingPropsCorrectly = ({ x }) =>
  React.createElement(ComponentWithProps, { x });
ComponentPassingPropsCorrectly.propTypes = {
  x: PropTypes.number.isRequired,
};

const ComponentPassingPropsBadly = ({ x }) =>
  React.createElement(ComponentWithProps, { x });  // x is a string, not number
ComponentPassingPropsBadly.propTypes = {
  x: PropTypes.string.isRequired,
};

const BrokenComponent = () => {
  throw new Error('I am a broken component');
};

const ComponentWithoutPropsPassingPropsBadly = () =>
  React.createElement(ComponentWithProps);

const flip = assert => ({
  pass: assert.fail,
  fail: assert.pass,
});


test('Component without props is ok', assert => {
  assert.plan(2);
  const props = {};
  comboTest(ComponentWithoutProps, { assert, props });
  comboTest(ComponentWithEmptyProps, { assert, props });
});

test('Component without props ignores extra props', assert => {
  // originally the plan was to fail in this case, but that doesn't work:
  // HOCs and other components that just pass all props to a child don't inherit
  // their propTypes, so we actually just can't know what's valid to pass as
  // props in and what's not.
  assert.plan(2);
  const props = {
    badProp: ['booo'],
  };
  comboTest(ComponentWithoutProps, { assert, props });
  comboTest(ComponentWithEmptyProps, { assert, props });
});

test('ComponentWithProps', assert => {
  assert.plan(6);
  comboTest(ComponentWithProps, {
    assert,
    props: { x: [1], y: [undefined] },
  });
  comboTest(ComponentWithProps, {
    assert,
    props: { x: [1], y: ['asdf'] },
  });
  comboTest(ComponentWithProps, {
    assert: flip(assert),
    props: {},
  });
  comboTest(ComponentWithProps, {
    assert: flip(assert),
    props: { y: ['asdf'] },
  });
  comboTest(ComponentWithProps, {
    assert: flip(assert),
    props: { x: [1], y: [true] },
  });
  comboTest(ComponentWithProps, {
    assert: assert,
    props: {
      x: [0, 1, -1],
      y: [undefined, '', 'abc'],
    },
  });
});

test('Component Passing Props to children', assert => {
  assert.plan(3);
  comboTest(ComponentPassingPropsCorrectly, {
    assert,
    props: { x: [1] },
  });
  comboTest(ComponentPassingPropsBadly, {
    assert: flip(assert),
    props: { x: ['x'] },
  });
  comboTest(ComponentWithoutPropsPassingPropsBadly, {
    assert: flip(assert),
    props: {},
  });
});

test('Components that throw fail checking', assert => {
  assert.plan(1);
  comboTest(BrokenComponent, { assert: flip(assert), props: {} });
});

test('Failing checks throw if assert is not provided', assert => {
  assert.plan(2);
  assert.doesNotThrow(() =>
    comboTest(ComponentWithoutProps, { props: {} })
    , 'Nothing explodes when checking succeeds without assert');

  assert.throws(() =>
    comboTest(ComponentWithProps, { props: {} })
    , 'Failing checks throw when assert is not provided');
});
