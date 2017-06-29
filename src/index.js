const React = require('react');
const PropTypes = require('prop-types');
const Shallow = require('react-test-renderer/shallow');

const Child = () => {
  throw new Error("hi")
};
Child.propTypes = {
  a: PropTypes.string.isRequired,
};

const Parent = () => {
  React.createElement('div', null,
    React.createElement(Child, null)
  );
};
const renderer = new Shallow();

renderer.render(React.createElement(Parent, null));

const result = renderer.getRenderOutput();

console.log({ result });
