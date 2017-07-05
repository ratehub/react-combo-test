const getCombos = require('./getCombos');
const checkWithProps = require('./checkWithProps');


const comboTest = (Component, options) => {
  if (typeof Component === 'undefined') {
    throw new Error('You must provide a Component for comboTest');
  }
  const propSamples = options.props || (() => {
    throw new Error('You must provide some sample props comboTest');
  })();
  const assert = options.assert || require('assert');

  const error = getCombos(propSamples).find(props =>
    checkWithProps(Component, props));

  if (error) {
    const fail = assert.fail || (msg => assert(false, msg));
    fail('booo');
  } else {
    const ok = assert.pass || (msg => assert(true, msg));
    ok('wooo');
  }
};


module.exports = comboTest;
