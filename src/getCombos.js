const mult = (vec, vecs) => vec
  .map(v => vecs.map(vv => [v].concat(vv)))  // prepend v to every vec
  .reduce((a, b) => a.concat(b));  // join all the [[]]s


const combos = arrayOfArrays => {
  const [x, ...xs] = arrayOfArrays;
  if (!x) {
    return [];
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


const propCombos = props => {
  const keys = Object.keys(props);
  const values = keys.map(k => props[k]);
  const valueCombos = combos(values);
  return valueCombos.map(combo => zipObj(keys, combo));
};


module.exports = propCombos;
