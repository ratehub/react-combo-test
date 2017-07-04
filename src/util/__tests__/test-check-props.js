import tape from 'tape';
import React from 'react';
import PropTypes from 'prop-types';
import Shallow from 'react-test-renderer/shallow';
import checkProps from '../check-props';


const test = (plan, description, Component, testFn) =>
  tape(description, assert => {
    const renderer = new Shallow();
    renderer.render(React.createElement(Component));
    const output = renderer.getRenderOutput();
    testFn(assert, output);
  });


const check = (Component, shouldPass, description) =>
  test(1, description, Component, (assert, output) => {
    let passed = true;
    try {
      checkProps(output);
    } catch (err) {
      passed = false;
    }
    if (passed !== shouldPass) {
      assert.fail(description);
    } else {
      assert.pass(description);
    }
  });


const Child = () =>
  null;

Child.propTypes = {
  x: PropTypes.string.isRequired
};


const GoodParent = () =>
  React.createElement(Child, {x: 'abc'});
check(GoodParent, true, 'checkProps works when a child gets good props');


const BadParent1 = () =>
  React.createElement(Child);
check(BadParent1, false, 'checkProps fails when a child is missing props');


const BadParent2 = () =>
  React.createElement(Child, {x: 123});
check(BadParent2, false, 'checkProps fails when a child gets bad props');
