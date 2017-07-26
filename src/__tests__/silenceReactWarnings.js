/* eslint-disable no-console */
const filterProbablyReact = log => (message, ...more) =>
  message.startsWith('Warning: ')
    ? null
    : log(message, ...more);


const silenceReactWarnings = doStuff => {
  const original = console.error;
  let result;
  try {
    console.error = filterProbablyReact(original);
    result = doStuff();
    console.error = original;
  } catch (err) {
    console.error = original;
    throw err;
  }
  return result;
};


module.exports = silenceReactWarnings;
