import test from 'tape';
import PropTypes from 'prop-types';
import checkPropValues from '../check-prop-values';


const check = (description, propTypes, props, shouldPass) =>
  test(description, assert => {
    assert.plan(1);
    const res = checkPropValues(propTypes, props, 'TestCheckPropValues');
    const passed = typeof res === 'undefined';
    if (passed !== shouldPass) {
      assert.fail(shouldPass ? res : 'should have failed');
    } else {
      assert.ok('passed');
    }
  });


check('checkPropValues base case: no props & nothing to check',
  {},
  {},
  true);

check('checkPropValues passes valid props',
  { x: PropTypes.number.isRequired },
  { x: [123] },
  true);

check('checkPropValues should pass for missing optional props',
  { x: PropTypes.number },
  {},
  true);

check('checkPropValues should fail for a bad value',
  { x: PropTypes.number },
  { x: ['abc'] },
  false);
