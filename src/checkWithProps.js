const React = require('react');
const Shallow = require('react-test-renderer/shallow');
const failConsoleErrors = require('./failConsoleErrors');

const checkWithProps = (Component, props) => {
  const name = Component.displayName || Component.name || '<<Anonymous>>';

  const componentProps = Object.keys(Component.propTypes || {});
  const checkingProps = Object.keys(props);

  let missing;
  if (missing = componentProps.find(name => !checkingProps.includes(name))) {
    return new Error(`No sample provided for prop: ${missing}`);
  }
  if (missing = checkingProps.find(name => !componentProps.includes(name))) {
    return new Error(`Sample provided for a prop without proptype: ${name}`);
  }

  const renderer = new Shallow();
  let err;
  const onFail = err_ =>
    err = err_;

  failConsoleErrors(onFail, () => {
    try {
      renderer.render(React.createElement(Component, props));
    } catch (err_) {
      err = new Error(`Component '${name}' threw while rendering: ${err_}`);
    }
  });

  return err;
};


module.exports = checkWithProps;
