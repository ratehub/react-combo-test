/* eslint-disable no-console */

const throwConsoleErrors = (fail, doStuff) => {
  const original = console.error;
  let result;
  try {
    console.error = (...args) => fail(args.join('\n'));
    result = doStuff();
    console.error = original;
  } catch (err) {
    console.error = original;
    throw err;
  }
  return result;
};


module.exports = throwConsoleErrors;
