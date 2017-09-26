/**
 * Check if a component is valid
 *
 * https://github.com/facebook/react/blob/8b39991819cb0a64eadf074725050e24a91e6a62/src/isomorphic/classic/element/ReactElementValidator.js#L232
 */

const React = require('react');


module.exports = type => {
  // Allow strings because they are accepted by react's own validation logic,
  // even though they're unlikely to be useful for comboTest's purposes.
  return typeof type === 'function' ||
         typeof type === 'string';
};
