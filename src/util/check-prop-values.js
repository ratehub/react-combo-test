
const checkPropValues = (propTypes, propValues, name) => {
  for (const prop of Object.keys(propTypes)) {
    let values = propValues[prop];
    if (typeof values === 'undefined') {
      values = [undefined];  // allow missing optional props to be unspecified: check with `undefined`
    }
    for (const value of values) {
      const propValueError = propTypes[prop]({ [prop]: value }, prop, name, 'prop');
      if (propValueError) {
        return `Err: ${String(propValueError)} | PropName: ${name} | Value: ${String(value)}`;
      }
    }
  }
};

export default checkPropValues;
