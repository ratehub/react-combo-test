import test from 'test-utils/test-simple';
import { PropTypes } from 'react';
import checkPropValues from '../check-prop-values';


const check = (description, propTypes, props, shouldPass) =>
  test(1, description, assert => {
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
