/* eslint-disable no-console */
const test = require('tape');
const failConsoleErrors = require('../failConsoleErrors');

test('console.error is mocked and restored', assert => {
  assert.plan(3);
  const original = console.error;

  let saved;
  const mocked = message =>
    saved = message;

  let cbHasRun = false;
  failConsoleErrors(mocked, () => {
    console.error('hello')
    assert.equal(saved, 'hello', 'console.error is mocked');
    cbHasRun = true;
  });

  assert.ok(cbHasRun, 'console.error is restored after the callback has run');
  assert.is(console.error, original, 'console.error is restored');
});

test('console.error is restored even when the callback throws', assert => {
  assert.plan(2);
  const original = console.error;

  assert.throws(() => failConsoleErrors(() => null, () => {
    throw new Error('some bad code');
  }), Error, 'the callback throws');

  assert.is(console.error, original, 'console.error is still restored.');
});
