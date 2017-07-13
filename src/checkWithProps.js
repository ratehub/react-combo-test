const React = require('react');
const Shallow = require('react-test-renderer/shallow');
const invariant = require('invariant');
const checkPropTypes = require('check-prop-types');
const silenceReactWarnings = require('./silenceReactWarnings');
const getName = require('./getName');


const getJSX = (Component, props) =>
  silenceReactWarnings(() => React.createElement(Component, props));


const checkChildren = shallowOutput => {
  if (!shallowOutput) return;
  const { type: Component, props } = shallowOutput;
  if (Component && Component.propTypes) {
    return checkRender(getJSX(Component, props));
  }
  if (props && props.children) {
    return props.children.reduce((err, child) =>
      err || checkChildren(child)
      , null);
  }
}


const checkRender = jsx => {
  const { type: Component, props } = jsx;

  // check the component's props
  const propError = checkPropTypes(Component.propTypes, props, 'prop',
    getName(Component));
  if (propError) return propError;

  // shallow-render the component
  const renderer = new Shallow();
  try {
    silenceReactWarnings(() => renderer.render(jsx));
  } catch (exc) {
    return `${getName(Component)} exploded while rendering: ${exc}`;
  }

  // recurse for all child components
  return checkChildren(renderer.getRenderOutput());
};


const checkWithProps = (Component, props, checkJSX) => {
  const jsx = getJSX(Component, props);
  const renderErr = checkRender(jsx);
  if (renderErr) {
    return renderErr;
  }
  if (checkJSX) {
    try {
      checkJSX(jsx, invariant, props);
    } catch (exc) {
      return `${exc}`;
    }
  }
};


module.exports = checkWithProps;
