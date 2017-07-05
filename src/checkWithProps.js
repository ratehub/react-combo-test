const React = require('react');
const Shallow = require('react-test-renderer/shallow');
const failConsoleErrors = require('./failConsoleErrors');
const getName = require('./getName');

const checkWithProps = (Component, props) => {
  const componentProps = Object.keys(Component.propTypes || {});
  const checkingProps = Object.keys(props);

  let missing;
  if (missing = componentProps.find(name => !checkingProps.includes(name))) {
    return `Missing samples for ${getName(Component)}.propTypes.${missing}`;
  }
  if (missing = checkingProps.find(name => !componentProps.includes(name))) {
    return `Prop '${missing}' is not in ${getName(Component)}.propTypes`;
  }

  const renderer = new Shallow();
  let err;
  const onFail = err_ =>
    err = err_;

  failConsoleErrors(onFail, () => {
    try {
      renderer.render(React.createElement(Component, props));
    } catch (err_) {
      err = `${getName(Component)} exploded while rendering: ${err_}`;
    }
  });

  return err;
};


module.exports = checkWithProps;
