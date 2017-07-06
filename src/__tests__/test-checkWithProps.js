const test = require('tape');
const React = require('react');
const PropTypes = require('prop-types');
const checkWithProps = require('../checkWithProps');

const Component = ({ x }) =>
  null;

Component.propTypes = {
  x: PropTypes.number.isRequired,
};

const Wrapped = (props) =>
  React.createElement(Component, props);


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
