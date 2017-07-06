const React = require('react');
const Shallow = require('react-test-renderer/shallow');
const checkPropTypes = require('check-prop-types');
const silenceReactWarnings = require('./silenceReactWarnings');
const getName = require('./getName');


const checkChildren = jsx => {
  if (!jsx) return;
  const { type: Component, props } = jsx;
  if (Component && Component.propTypes) {
    return checkWithProps(Component, props);
  }
  if (props && props.children) {
    if (!Array.isArray(props.children)) {
      return props.children.reduce((err, child) =>
        err || checkChildren(child)
        , null);
    }
    return checkChildren(props.children);
  }
}


const checkWithProps = (Component, props) => {
  // check the component's props
  const propError = checkPropTypes(Component.propTypes, props, 'prop',
    getName(Component));
  if (propError) return propError;

  // recurse for all child components
  const renderer = new Shallow();
  try {
    silenceReactWarnings(() =>
      renderer.render(React.createElement(Component, props)));
  } catch (exc) {
    return `${getName(Component)} exploded while rendering: ${exc}`;
  }
  return checkChildren(renderer.getRenderOutput());
};


module.exports = checkWithProps;
