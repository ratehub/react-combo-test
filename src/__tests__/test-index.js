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

test('Component without props fails if props are provided', assert => {
  assert.plan(2);
  const props = {
    badProp: ['booo'],
  };
  comboTest(ComponentWithoutProps, { assert: flip(assert), props });
  comboTest(ComponentWithEmptyProps, { assert: flip(assert), props });
});

test('ComponentWithProps', assert => {
  assert.plan(5);
  comboTest(ComponentWithProps, {
    assert,
    props: { x: [1] },
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
