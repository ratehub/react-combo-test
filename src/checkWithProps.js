const { createElement } = require('react');
const Renderer = require('react-test-renderer');
const invariant = require('invariant');
const getName = require('./getName');


const checkWithProps = (Component, props, checkJSX) => {
  const jsx = createElement(Component, props);
  try {
    Renderer.create(jsx);
  } catch (exc) {
    throw new Error(`${getName(Component)} exploded while rendering: ${exc}`);
  }
  if (checkJSX) {
    checkJSX(jsx, invariant, props);
  }
};


module.exports = checkWithProps;
