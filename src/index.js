let unpatch;
if (typeof jest !== 'undefined') {
  unpatch = require('./patchTypeSpecForJest');
} else {
  unpatch = require('./patchTypeSpec');
}

const { isValidElement } = require('react');
const isValidComponent = require('./isValidComponent');
const getCombos = require('./getCombos');
const checkWithProps = require('./checkWithProps');
const getName = require('./getName');
const usefulStack = require('./usefulStack');


const comboTest = (Component, props, options = {}) => {
  if (!isValidComponent(Component)) {
    if (Component == null) {  // null or undefined
      throw new Error('You must provide a Component for comboTest');
    }
    if (isValidElement(Component)) {
      throw new Error('Pass the component itself, not JSX. ' +
        'eg., `comboTest(Component, {})`, not `comboTest(<Component />, {})`');
    }
    throw new Error('The component type provided to comboTest was invalid. ' +
      `Expected a function, class, or string, but found '${typeof Component}'`);
  }
  const propSamples = props || (() => {
    throw new Error('You must provide sample props for comboTest');
  })();
  const assert = options.assert || require('assert');
  const shouldSkipCombo = options.shouldSkipCombo;
  const checkJSX = options.check;

  const combos = getCombos(propSamples, shouldSkipCombo);
  const error = combos.reduce((err, props) => {
    if (err) return err;
    try {
      checkWithProps(Component, props, checkJSX);
    } catch (exc) {
      return exc;
    }
  }, null);

  if (error) {
    const fail = assert.ifError || assert.fail || (msg => assert(false, msg));
    const nice = usefulStack(error);
    fail(`<${getName(Component)}> failed checking: ${nice}`);
  } else {
    const ok = assert.pass || (msg => (assert.ok || assert)(true, msg));
    const checks = combos.length === 1 ? 'check' : 'checks';
    ok(`<${getName(Component)}> passed ${combos.length} ${checks}`);
  }
};


module.exports = comboTest;
module.exports.unpatch = unpatch;
