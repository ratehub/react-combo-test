import React, { PropTypes } from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import checkProps from '../check-props';


const test = harness((plan, description, Component) =>
  sticky.compose(
    sticky.declare(description),
    sticky.countAsserts(plan),
    sticky.timeout(100),
    sticky.injectFactory(() => {
      const renderer = ReactTestUtils.createRenderer();
      renderer.render(React.createElement(Component));
      const output = renderer.getRenderOutput();
      return sticky.inject(output);
    })
  ));


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
