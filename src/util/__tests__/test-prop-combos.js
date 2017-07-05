import test from 'tape';
import propCombos from '../prop-combos';


test('propCombos should throw if any prop has zero values', assert => {
  assert.plan(1);
  assert.throws(() => propCombos({ a: [] }), 'should throw for empty prop value array');
});


test('propCombos should make all the combos', assert => {
  assert.plan(6);

  assert.deepEqual(
    propCombos({}),
    [],
    'shoudl create zero combos if there are no props');

  assert.deepEqual(
    propCombos({ a: [1] }),
    [{ a: 1 }],
    'should work for a single prop with one value');

  assert.deepEqual(
    propCombos({ a: [1, 2] }),
    [{ a: 1 }, { a: 2 }],
    'should work for two values on one prop');

  assert.deepEqual(
    propCombos({ a: [1], b: ['x'] }),
    [{ a: 1, b: 'x' }],
    'should do two props, one value');

  assert.deepEqual(
    propCombos({ a: [1, 2], b: ['x'] }),
    [
      { a: 1, b: 'x' },
      { a: 2, b: 'x' }
    ],
    'should handle two props, multiple values');

  assert.deepEqual(
    propCombos({ a: [1, 2], b: ['x', 'y'] }),
    [
      { a: 1, b: 'x' },
      { a: 1, b: 'y' },
      { a: 2, b: 'x' },
      { a: 2, b: 'y' }
    ],
    'and even more values...');
});
