/* eslint-disable no-console */
const test = require('tape');
const silenceReactWarnings = require('../silenceReactWarnings');

test('console.error is mocked and restored', assert => {
  assert.plan(3);
  const original = console.error;

  let cbHasRun = false;
  silenceReactWarnings(() => {
    assert.isNot(console.error, original);
    cbHasRun = true;
  });

  assert.ok(cbHasRun, 'console.error is restored after the callback has run');
  assert.is(console.error, original, 'console.error is restored');
});

test('console.error is restored even when the callback throws', assert => {
  assert.plan(2);
  const original = console.error;

  assert.throws(() => silenceReactWarnings(() => {
    throw new Error('some bad code');
  }), Error, 'the callback throws');

  assert.is(console.error, original, 'console.error is still restored.');
});

test('react-like warnings are filtered', assert => {
  assert.plan(2);
  const original = console.error;

  let logged = null;
  console.error = (...args) =>
    logged = args;

  silenceReactWarnings(() =>
    console.error('Warning: I am like a react warning'));
  assert.is(logged, null);

  silenceReactWarnings(() =>
    console.error('I am not like a react warning'));
  assert.deepEqual(logged, ['I am not like a react warning']);

  console.error = original;
});
