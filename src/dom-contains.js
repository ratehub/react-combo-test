const nodeAssert = require('assert');

const domContains = (root, thing) => {
  try {
    nodeAssert.deepEqual(root, thing);
    return true;
  } catch (err) {
    if (root && root.props && root.props.children) {
      const children = root.props.children;
      if (Array.isArray(children)) {
        return children.some(child => domContains(child, thing));
      }
      return domContains(children, thing);
    }
    return false;
  }
};

module.exports = domContains;
