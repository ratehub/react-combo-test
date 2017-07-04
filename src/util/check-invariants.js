const checkInvariants = (invariants, props, output) => {
  if (invariants.some(inv => !inv.description)) {
    throw new Error('Invariant missing description');
  }
  const applicable = invariants.filter(inv =>
    inv.when ?
      inv.when(props) :
      true);
  applicable
    .filter(inv => !inv.check(props, output))
    .forEach(inv => {
      throw new Error(`Invariant violation: ${inv.description} | props: ${JSON.stringify(props)}`);
    });
  return applicable.length;
};


export default checkInvariants;
