
const checkPropValues = (propTypes, propValues, name) => {
  for (const prop of Object.keys(propTypes)) {
    for (const value of propValues[prop]) {
      const propValueError = propTypes[prop]({ prop: value }, 'prop', name, 'prop');
      if (propValueError) {
        return `Err: ${String(propValueError)} | PropName: ${name} | Value: ${value.toString()}`;
      }
    }
  }
};

export default checkPropValues;
