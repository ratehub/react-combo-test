const test = require('tape');
const { createElement: e } = require('react');
const PropTypes = require('prop-types');
const { inject } = require('mobx-react');
const checkWithProps = require('../checkWithProps');

const Component = ({ x }) =>
  null;

Component.propTypes = {
  x: PropTypes.number.isRequired,
};

const Wrapped = (props) =>
  e(Component, props);

const WrappedManyChildren = () =>
  e('div', null,
    e(Component, { x: 2 }),
    e(Component, { x: 3 }));

const BlahWrapped = ({ children }) =>
  e('div', null, ...children);

const CompositeWrappedManyChildren = () =>
  e(BlahWrapped, null,
    e(Component, { x: 2 }),
    e(Component, { x: 3 }));

const Broken = () => {
  throw new Error('I am broken');
}


test('checkWithProps returns falsy for good props', assert => {
  assert.plan(2);
  assert.ifError(checkWithProps(Component, { x: 0 }),
    'no error for good props');
  assert.ifError(checkWithProps(Wrapped, { x: 1 }),
    'no error for good passed props');
});


test('Bad proptypes are returned as an error', assert => {
  assert.plan(3);
  let err;

  err = checkWithProps(Component, {});
  assert.ok(err, err);

  err = checkWithProps(Component, { x: 'asdf' });
  assert.ok(err, err);

  err = checkWithProps(Wrapped, { x: true });
  assert.ok(err, err);
});


test('check with invariants', assert => {
  assert.plan(2);
  let err;

  err = checkWithProps(() => null, {}, (_, inv) => inv(false, 'noooooooooope'));
  assert.equal(err,
    'Invariant Violation: noooooooooope');

  err = checkWithProps(() => null, {}, (_, inv) => inv(true, 'truly true'));
  assert.ifError(err, 'invariant passes');
});


test('check array of children', assert => {
  assert.plan(2);
  assert.ifError(checkWithProps(WrappedManyChildren, {}),
    'no error for component with array of children');
  assert.ifError(checkWithProps(CompositeWrappedManyChildren, {}),
    'no error for composite component with array of children');
});

test('Regression: mobx injector prevents rendering', assert => {
  assert.plan(1);
  const err = checkWithProps(inject('x')(Broken), { x: [1] });
  assert.ok(err, err);
});
