const React = require('react');
const Shallow = require('react-test-renderer/shallow');
const failConsoleErrors = require('./failConsoleErrors');

const checkWithProps = (Component, props) => {
  const name = Component.displayName || Component.name || '<<Anonymous>>';
  const renderer = new Shallow();
  let err;

  const fail = err_ =>
    err = err_;

  failConsoleErrors(fail, () =>
    renderer.render(React.createElement(Component, props)));

  return err;
};


module.exports = checkWithProps;
