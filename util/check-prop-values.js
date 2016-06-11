const checkPropValues = (propTypes, propValues, name) => {
  for (const prop of Object.keys(propTypes)) {
    for (const value of propValues[prop]) {
      const result = propTypes[prop]({ prop: value }, 'prop', name, 'prop');
      if (result) {
        return result;
      }
    }
  }
};


export default checkPropValues;
