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


const checkComponent = (Component, {
  props: propValues,
  invariants = []
}) => test(`<${Component.displayName || Component.name} /> renders without throwing`, (assert, renderer) => {

  let renderOk = true;
  let invariantCount = 0;
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

    const output = renderer.getRenderOutput();

    try {
      checkProps(output);
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${JSON.stringify(props)}`);
      continue;
    }

    try {
      invariantCount += checkInvariants(invariants, props, output);
    } catch (err) {
      renderOk = false;
      assert.fail(`${String(err)} | props: ${JSON.stringify(props)}`);
      continue;
    }

  }

  if (renderOk) {
    assert.pass(`Rendered ${cs.length} combinations of props satisfying ${invariantCount} invariant checks for ${name}`);
  }
});


module.exports = checkComponent;
