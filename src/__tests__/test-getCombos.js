const test = require('tape');
const getCombos = require('../getCombos');


test('getCombos should throw if any prop has zero values', assert => {
  assert.plan(1);
  assert.throws(() => getCombos({ a: [] }),
    'should throw for empty prop value array');
});


test('getCombos should make all the combos', assert => {
  assert.plan(6);

  assert.deepEqual(
    getCombos({}),
    [{}],
    'shoudl create one set of empty props if there are no prop samples');

  assert.deepEqual(
    getCombos({ a: [1] }),
    [{ a: 1 }],
    'should work for a single prop with one value');

  assert.deepEqual(
    getCombos({ a: [1, 2] }),
    [{ a: 1 }, { a: 2 }],
    'should work for two values on one prop');

  assert.deepEqual(
    getCombos({ a: [1], b: ['x'] }),
    [{ a: 1, b: 'x' }],
    'should do two props, one value');

  assert.deepEqual(
    getCombos({ a: [1, 2], b: ['x'] }),
    [
      { a: 1, b: 'x' },
      { a: 2, b: 'x' }
    ],
    'should handle two props, multiple values');

  assert.deepEqual(
    getCombos({ a: [1, 2], b: ['x', 'y'] }),
    [
      { a: 1, b: 'x' },
      { a: 1, b: 'y' },
      { a: 2, b: 'x' },
      { a: 2, b: 'y' }
    ],
    'and even more values...');
});

test('getCombos skips when shouldSkip() => true', assert => {
  assert.plan(2);
  assert.throws(() =>
    getCombos({ a: [1, 2], b: [3, 4] }, () => true)
    , 'should error if there are no valid combos to check');
  assert.deepEqual(
    getCombos({ a: [1, 2], b: [true, false] }, ({ a, b }) => b && a % 2),
    [
      { a: 1, b: false },
      { a: 2, b: true },
      { a: 2, b: false },
    ],
    'shouldSkip skips only when it returns true');
});
