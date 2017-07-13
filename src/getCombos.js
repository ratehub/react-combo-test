const assert = require('assert');


const mult = (vec, vecs) => vec
  .map(v => vecs.map(vv => [v].concat(vv)))  // prepend v to every vec
  .reduce((a, b) => a.concat(b));  // join all the [[]]s


const combos = arrayOfArrays => {
  const [x, ...xs] = arrayOfArrays;
  if (!x) {
    return [{}];
  } else if (!xs.length) {
    if (!x.length) {
      throw new Error('Every prop must be provided at least one value');
    }
    return x.map(v => [v]);
  }
  return mult(x, combos(xs));
};


const zipObj = (keys, values) => {
  const out = {};
  keys.forEach((k, i) => out[k] = values[i]);
  return out;
};


const propCombos = (props, shouldSkip = () => false) => {
  const keys = Object.keys(props);
  const values = keys.map(k => props[k]);
  const valueCombos = combos(values);

  const allCombos = valueCombos.map(combo => zipObj(keys, combo));
  assert(allCombos.length,
    'At least one propCombo should always be generated.');

  const testCombos = allCombos.filter(combo => !shouldSkip(combo));
  assert(testCombos.length,
    'At least one combo must be valid but shouldSkipCombo rejected them all.');

  return testCombos;
};


module.exports = propCombos;
