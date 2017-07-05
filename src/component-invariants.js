const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const sticky = require('@openride/sticky-test');
const harness = require('./harness');

const componentInvariants = (Component, defaultProps, invariants) => {
  const setup = whenProps => {
    const renderer = ReactTestUtils.createRenderer();
    const props = Object.assign({}, defaultProps, whenProps);
    const element = React.createElement(Component, props);
    renderer.render(element);
    const result = renderer.getRenderOutput();
    return Promise.resolve([result]);
  };

  const test = harness((name, whenProps) => sticky.compose(
    sticky.declare(name),
    sticky.countAsserts(1),
    sticky.withResource(
      () => setup(whenProps),
      () => null
    ),
    sticky.timeout(100)
  ));

  invariants.forEach(inv => {
    const name = Component.displayName || Component.name;
    const propsRepr = Object.keys(inv.when).map(k =>
      `${k}={${JSON.stringify(inv.when[k])}}`).join(' ');
    const testDeclaration = `<${name} ${propsRepr}>`;
    const assertBody = (s => s
      .slice(s.indexOf('=>') + '=>'.length)
      .trim()
    )(inv.assert.toString());
    test(testDeclaration, inv.when, (assert, output) =>
      assert(inv.assert(output), assertBody));
  });
};

module.exports = componentInvariants;
