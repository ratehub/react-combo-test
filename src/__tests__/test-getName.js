const { createElement } = require('react');
const test = require('tape');
const getName = require('../getName');

test('getName for anonymous component', assert => {
  assert.plan(1);
  assert.equal(getName(createElement(() => null).type), '<Unnamed Component>');
});
