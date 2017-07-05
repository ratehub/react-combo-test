const getCombos = require('./getCombos');
const checkWithProps = require('./checkWithProps');
const getName = require('./getName');


const comboTest = (Component, options) => {
  if (typeof Component === 'undefined') {
    throw new Error('You must provide a Component for comboTest');
  }
  const propSamples = options.props || (() => {
    throw new Error('You must provide some sample props comboTest');
  })();
  const assert = options.assert || require('assert');

  const combos = getCombos(propSamples);
  let error;

  if (combos.length === 0) {
    error = checkWithProps(Component, {});
  } else {
    error = combos.reduce((err, props) =>
      err || checkWithProps(Component, props)
      , null);
  }

  if (error) {
    const fail = assert.fail || (msg => assert(false, msg));
    fail(`<${getName(Component)}> failed checking: ${error}`);
  } else {
    const ok = assert.pass || (msg => assert(true, msg));
    ok(`<${getName(Component)}> passed ${combos.length || 1} checks`);
  }
};


module.exports = comboTest;
