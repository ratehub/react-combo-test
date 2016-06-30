import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import sticky from '@openride/sticky-test';
import harness from './harness';
import checkPropValues from './util/check-prop-values';
import checkInvariants from './util/check-invariants';
import checkProps from './util/check-props';
import propCombos from './util/prop-combos';


const test = harness((description) => sticky.compose(
  sticky.declare(description),
  sticky.assert,
  sticky.timeout(100),
  sticky.inject(ReactTestUtils.createRenderer())
));


const typify = obj =>
  Object.keys(obj)
    .map(k => `${k}: ${typeof obj[k]}`)
    .join(', ');


const checkComponent = (Component, {
  description = 'renders without throwing',
  props: propValues = {},
  invariants = []
} = {}) => test(`<${Component.displayName || Component.name} /> ${description}`, (assert, renderer) => {

  let renderOk = true;
  let invariantCount = 0;
  const name = Component.displayName || Component.name || 'UnnamedComponent';
  const propTypes = Component.propTypes || {};

  const propValueErr = checkPropValues(propTypes, propValues, name);
  if (propValueErr) {
    assert.fail(`Bad prop value: ${String(propValueErr)}`);
  }

  let cs = propCombos(propValues);
  if (cs.length === 0) {
    const nProps = Object.keys(propTypes).length;
    const nValueProps = Object.keys(propValues).length;
    if (nProps === 0 &&
        nValueProps === 0) {
      // a static component with no props to test with can still be checked with a propless render
      cs = [{}];
    } else {
      renderOk = false;
      assert.fail('no prop combos to try');
    }
  }

  for (const props of cs) {
    try {
      renderer.render((<Component {...props} />));
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${typify(props)}`);
      continue;
    }

    const output = renderer.getRenderOutput();

    try {
      checkProps(output);
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${typify(props)}`);
      continue;
    }

    try {
      invariantCount += checkInvariants(invariants, props, output);
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${typify(props)}`);
      continue;
    }

  }

  if (renderOk) {
    assert.pass(`Rendered ${cs.length} combinations of props satisfying ${invariantCount} invariant checks for ${name}`);
  }
});


module.exports = checkComponent;
