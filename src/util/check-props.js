const checkProps = tree => {
  if (tree && tree.type && tree.type.propTypes) {
    Object.keys(tree.type.propTypes)
      .forEach(prop => {
        const checkResult = tree.type.propTypes[prop](tree.props, prop, tree.type.displayName || tree.type.name || '<<anonymous>>');
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
