const { createElement } = require('react');
const Renderer = require('react-test-renderer');
const invariant = require('invariant');
const getName = require('./getName');


const checkWithProps = (Component, props, checkJSX) => {
  const jsx = createElement(Component, props);
  Renderer
    .create(jsx)  // propTypes checking has been shimmed to throw on error
    .unmount();  // finish the component lifecycle (resource management?)
  if (checkJSX) {
    checkJSX(jsx, invariant, props);
  }
};


module.exports = checkWithProps;
