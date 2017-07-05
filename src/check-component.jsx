const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const sticky = require('@openride/sticky-test');
const harness = require('./harness');
const checkPropValues = require('./util/check-prop-values');
const checkInvariants = require('./util/check-invariants');
const checkProps = require('./util/check-props');
const propCombos = require('./util/prop-combos');
const { Phone, Desktop } = require('../app/components/device-type.js');

const test = harness((description) => sticky.compose(
  sticky.declare(description),
  sticky.assert,
  sticky.timeout(100),
  sticky.inject(ReactTestUtils.createRenderer())
));

const DEVICE_TYPES = [ Phone(), Desktop() ];

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
      DEVICE_TYPES.forEach(deviceType => {
        try {
          renderer.render((<Component {...props} />), { deviceType });        
        } catch (err) {
          renderOk = false;
          assert.fail(`${String(err)} | props: ${typify(props)} | deviceType: ${deviceType.toString()}`);
        }
      });
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
