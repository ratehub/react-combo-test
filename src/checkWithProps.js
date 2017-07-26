const { createElement } = require('react');
const Renderer = require('react-test-renderer');
const invariant = require('invariant');
const getName = require('./getName');


const checkWithProps = (Component, props, checkJSX) => {
  const jsx = createElement(Component, props);
  Renderer.create(jsx);
  if (checkJSX) {
    checkJSX(jsx, invariant, props);
  }
};


module.exports = checkWithProps;
