const test = require('tape');
const { createElement: e } = require('react');
const PropTypes = require('prop-types');
const { Provider, inject } = require('mobx-react');
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

const PassingContext = () =>
  e(Provider, { x: 1 },
    e(inject('x')(Component)));


test('checkWithProps returns falsy for good props', assert => {
  assert.plan(2);
  assert.ifError(checkWithProps(Component, { x: 0 }),
    'no error for good props');
  assert.ifError(checkWithProps(Wrapped, { x: 1 }),
    'no error for good passed props');
});


test('Bad proptypes are thrown', assert => {
  assert.plan(3);
  let err;

  assert.throws(() =>
    checkWithProps(Component, {}), 'missing x');

  assert.throws(() =>
    checkWithProps(Component, { x: 'asdf' }), 'string instead of number for x');

  assert.throws(() =>
    checkWithProps(Wrapped, { x: true }), 'bool instead of number for x');
});


test('check with invariants', assert => {
  assert.plan(2);

  try {
    checkWithProps(() => null, {}, (_, inv) => inv(false, 'noooooooooope'));
  } catch (err) {
    assert.equal(`${err}`,
      'Invariant Violation: noooooooooope');
  }

  assert.doesNotThrow(() =>
    checkWithProps(() => null, {}, (_, inv) => inv(true, 'truly true')));
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
  try {
    checkWithProps(inject('x')(Broken), { x: [1] });
  } catch (err) {
    assert.ok(err, `${err}`);
  }
});

test('Regression: context is kept while rendering down the tree', assert => {
  assert.plan(1);
  assert.ifError(checkWithProps(PassingContext, {}));
});
