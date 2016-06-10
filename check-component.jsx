const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const sticky = require('@openride/sticky-test');
const harness = require('./harness');


const test = harness((description) => sticky.compose(
  sticky.declare(description),
  sticky.assert,
  sticky.timeout(100),
  sticky.inject(ReactTestUtils.createRenderer())
));


const checkProps = tree => {
  if (tree && tree.type && tree.type.propTypes) {
    Object.keys(tree.type.propTypes)
      .forEach(prop => {
        const checkResult = tree.type.propTypes[prop](tree.props, prop, tree.type.displayName || tree.type.name || '<<anonymous>>');
        if (checkResult) {
          throw checkResult;
        }
      });
  }
  if (tree && tree.props && tree.props.children) {
    if (Array.isArray(tree.props.children)) {
      tree.props.children.forEach(checkProps);
    } else {
      checkProps(tree.props.children);
    }
  }
};


const checkPropValues = (propTypes, propValues, name) => {
  for (const prop of Object.keys(propTypes)) {
    for (const value of propValues[prop]) {
      const result = propTypes[prop]({ prop: value }, 'prop', name, 'prop');
      if (result) {
        return result;
      }
    }
  }
};


const mult = (vec, vecs) => vec
  .map(v => vecs.map(vv => [v].concat(vv)))  // prepend v to every vec
  .reduce((a, b) => a.concat(b));  // join all the [[]]s


const combos = arrayOfArrays => {
  const [x, ...xs] = arrayOfArrays;
  if (!x) {
    return [];
  } else if (!xs.length) {
    return x.map(v => [v]);
  } else {
    return mult(x, combos(xs));
  }
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


const checkComponent = (Component, {
  props: propValues
}) => test(`<${Component.displayName || Component.name} /> renders without throwing`, (assert, renderer) => {

  let renderOk = true;
  const name = Component.displayName || Component.name || 'UnnamedComponent';

  if (!Component.propTypes) {
    throw new Error(`No propTypes to check for <${name} />`);
  }

  const propValueErr = checkPropValues(Component.propTypes, propValues);
  if (propValueErr) {
    assert.fail(`Bad prop value: ${String(propValueErr)}`);
  }

  const cs = propCombos(propValues);
  if (cs.length === 0) {
    renderOk = false;
    assert.fail('no prop combos to try');
  }

  for (const props of cs) {
    try {
      renderer.render((<Component {...props} />));
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${JSON.stringify(props)}`);
      continue;
    }
    try {
      checkProps(renderer.getRenderOutput());
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${JSON.stringify(props)}`);
    }
  }
  if (renderOk) {
    assert.pass(`Rendered ${cs.length} combinations of props for ${name} without throwing`);
  }
});


module.exports = checkComponent;
