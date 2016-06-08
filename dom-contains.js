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
      } else {
        return domContains(children, thing);
      }
    } else {
      return false;
    }
  }
};

module.exports = domContains;
