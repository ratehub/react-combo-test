const test = require('tape');
const { createElement: e } = require('react');
const PropTypes = require('prop-types');
const { shallow } = require('enzyme');
const comboTest = require('..');

const ComponentWithoutProps = () =>
  null;

const ComponentWithEmptyProps = () =>
  null;
ComponentWithEmptyProps.propTypes = {};

const ComponentWithProps = () =>
  null;
ComponentWithProps.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.string,
};

const ComponentPassingPropsCorrectly = ({ x }) =>
  e(ComponentWithProps, { x });
ComponentPassingPropsCorrectly.propTypes = {
  x: PropTypes.number.isRequired,
};

const ComponentPassingPropsBadly = ({ x }) =>
  e(ComponentWithProps, { x });  // x is a string, not number
ComponentPassingPropsBadly.propTypes = {
  x: PropTypes.string.isRequired,
};

const BrokenComponent = () => {
  throw new Error('I am a broken component');
};

const ComponentWithoutPropsPassingPropsBadly = () =>
  e(ComponentWithProps);

const ComponentWithInvalidCombos = ({ mode, value }) =>
  ({
    number: n => {
      n.toFixed(1);
      return null;
    },
    letter: s => {
      s.toLowerCase();
      return null;
    },
  })[mode](value);
ComponentWithInvalidCombos.propTypes = {
  mode: PropTypes.oneOf(['number', 'letter']).isRequired,
  value: PropTypes.any.isRequired,
};

const LabeledNumber = ({ label, value }) =>
  e('p', null,
    label && e('span', { className: 'label' }, label));
LabeledNumber.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};


const flip = assert => ({
  pass: assert.fail,
  fail: assert.pass,
});


test('Component without props is ok', assert => {
  assert.plan(2);
  const props = {};
  comboTest(ComponentWithoutProps, { assert, props });
  comboTest(ComponentWithEmptyProps, { assert, props });
});

test('Component without props ignores extra props', assert => {
  // originally the plan was to fail in this case, but that doesn't work:
  // HOCs and other components that just pass all props to a child don't inherit
  // their propTypes, so we actually just can't know what's valid to pass as
  // props in and what's not.
  assert.plan(2);
  const props = {
    badProp: ['booo'],
  };
  comboTest(ComponentWithoutProps, { assert, props });
  comboTest(ComponentWithEmptyProps, { assert, props });
});

test('ComponentWithProps', assert => {
  assert.plan(6);
  comboTest(ComponentWithProps, {
    assert,
    props: { x: [1], y: [undefined] },
  });
  comboTest(ComponentWithProps, {
    assert,
    props: { x: [1], y: ['asdf'] },
  });
  comboTest(ComponentWithProps, {
    assert: flip(assert),
    props: {},
  });
  comboTest(ComponentWithProps, {
    assert: flip(assert),
    props: { y: ['asdf'] },
  });
  comboTest(ComponentWithProps, {
    assert: flip(assert),
    props: { x: [1], y: [true] },
  });
  comboTest(ComponentWithProps, {
    assert: assert,
    props: {
      x: [0, 1, -1],
      y: [undefined, '', 'abc'],
    },
  });
});

test('Component Passing Props to children', assert => {
  assert.plan(3);
  comboTest(ComponentPassingPropsCorrectly, {
    assert,
    props: { x: [1] },
  });
  comboTest(ComponentPassingPropsBadly, {
    assert: flip(assert),
    props: { x: ['x'] },
  });
  comboTest(ComponentWithoutPropsPassingPropsBadly, {
    assert: flip(assert),
    props: {},
  });
});

test('Components that throw fail checking', assert => {
  assert.plan(1);
  comboTest(BrokenComponent, { assert: flip(assert), props: {} });
});

test('coverage: more than one failing combo', assert => {
  assert.plan(1);
  comboTest(BrokenComponent, { assert: flip(assert), props: { x: [1, 2] } });
});

test('Failing checks throw if assert is not provided', assert => {
  assert.plan(2);
  assert.doesNotThrow(() =>
    comboTest(ComponentWithoutProps, { props: {} })
    , 'Nothing explodes when checking succeeds without assert');

  assert.throws(() =>
    comboTest(ComponentWithProps, { props: {} })
    , 'Failing checks throw when assert is not provided');
});

test('Custom plain function assert', assert => {
  assert.plan(3);
  let result;
  const fnAssert = (ok, message) =>
    result = [ok, message]

  comboTest(ComponentWithoutProps, {
    assert: fnAssert,
    props: {},
  });
  assert.deepEqual(result, [true, '<ComponentWithoutProps> passed 1 checks']);

  comboTest(BrokenComponent, {
    assert: fnAssert,
    props: {},
  });

  const [ok, msg] = result;
  assert.false(ok);
  assert.deepEqual(msg.split('\n')[0],
    '<BrokenComponent> failed checking: Error: I am a broken component');
});

test('Custom pass/fail assert', assert => {
  assert.plan(2);
  let passMessage, failMessage;
  const myAssert = {
    pass: msg => passMessage = msg,
    fail: msg => failMessage = msg,
  };

  comboTest(ComponentWithoutProps, {
    assert: myAssert,
    props: {},
  });
  assert.deepEqual(passMessage, '<ComponentWithoutProps> passed 1 checks');

  comboTest(BrokenComponent, {
    assert: myAssert,
    props: {},
  });

  assert.deepEqual(failMessage.split('\n')[0],
    '<BrokenComponent> failed checking: Error: I am a broken component');
});

test('Custom ok assert', assert => {
  assert.plan(2);

  let message;
  const myAssert = {
    ok: (ok, msg) => {
      assert.ok(ok, 'ok must be called with true for assert.ok');
      message = msg;
    },
  };

  comboTest(ComponentWithoutProps, {
    assert: myAssert,
    props: {},
  });
  assert.deepEqual(message, '<ComponentWithoutProps> passed 1 checks');
});


test('Skip invalid combos', assert => {
  assert.plan(1);

  comboTest(ComponentWithInvalidCombos, {
    assert,
    props: {
      mode: ['number', 'letter'],
      value: [1, 'a'],
    },
    shouldSkipCombo: ({ mode, value }) =>
      (mode === 'number' && typeof value !== 'number') ||
      (mode === 'letter' && typeof value !== 'string'),
  });
});


test('Invariants are checked', assert => {
  assert.plan(2);
  let checked = false;

  comboTest(LabeledNumber, {
    assert,
    props: {
      label: ['', 'A', 'zed'],
      value: [-1, 0, 1],
    },
    check: (jsx, invariant, props) => {
      checked = true;
      const wrapper = shallow(jsx);
      const label = wrapper.find('.label');
      if (props.label.length) {
        invariant(label.exists(),
          'A label is rendered when label is not empty');
      } else {
        invariant(!label.exists(),
          'No label is rendered when label is empty');
      }
    },
  });

  assert.ok(checked);
});


test('A component must be provided', assert => {
  assert.plan(1);
  assert.throws(() => comboTest(undefined, { props: {} }));
});


test('Sample props must be provided', assert => {
  assert.plan(2);
  assert.throws(() => comboTest(ComponentWithoutProps));
  assert.throws(() => comboTest(ComponentWithoutProps, {}));
});
