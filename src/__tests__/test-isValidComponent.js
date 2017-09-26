const test = require('tape');
const { Component, createElement } = require('react');
const isValidComponent = require('../isValidComponent');

const SFC = () => null;

class ClassComponent extends Component {
}

test('isValidComponent', assert => {
  assert.plan(6);
  assert.ok(isValidComponent(SFC), 'Stateless components are valid');
  assert.ok(isValidComponent(ClassComponent), 'Class components are valid');
  assert.notOk(isValidComponent(), 'undefined is not a valid component');
  assert.notOk(isValidComponent({}), 'objects are not valid');
  assert.notOk(isValidComponent(null), 'null is not a valid component');
  assert.notOk(isValidComponent(createElement(SFC)), 'JSX is not valid');
});
