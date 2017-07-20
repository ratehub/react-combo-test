const test = require('tape');
const getName = require('../getName');

test('getName', assert => {
  assert.plan(3);
  const Anonymous = (() => () => null)();
  const FnNamed = () => null;
  const DisplayNamed = () => null;
  DisplayNamed.displayName = 'A name for display';
  assert.equal(getName(Anonymous), '<Unnamed Component>');
  assert.equal(getName(FnNamed), 'FnNamed');
  assert.equal(getName(DisplayNamed), 'A name for display');
});
