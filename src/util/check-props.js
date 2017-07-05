const checkProps = tree => {
  if (tree && tree.type && tree.type.propTypes) {
    Object.keys(tree.type.propTypes)
      .forEach(prop => {
        const checkResult = tree.type.propTypes[prop](tree.props, prop, tree.type.displayName || tree.type.name || '<<anonymous>>', null, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        if (checkResult) {
          throw checkResult;
        }
      });
  }
  if (tree && tree.props && tree.props.children) {
    if (Array.isArray(tree.props.children)) {
      tree.props.children.forEach(checkProps);
    } else {
      checkProps(tree.props.children);
    }
  }
};


export default checkProps;
