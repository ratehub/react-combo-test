const test = require('tape');
const { createElement: e, Component } = require('react');
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
  comboTest(ComponentWithoutProps, {}, { assert });
  comboTest(ComponentWithEmptyProps, {}, { assert });
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
  comboTest(ComponentWithoutProps, props, { assert });
  comboTest(ComponentWithEmptyProps, props, { assert });
});

test('ComponentWithProps', assert => {
  assert.plan(6);

  comboTest(ComponentWithProps, {
    x: [1], y: [undefined],
  }, { assert });

  comboTest(ComponentWithProps, {
    x: [1], y: ['asdf'],
  }, { assert });

  comboTest(ComponentWithProps, {
  }, { assert: flip(assert) });

  comboTest(ComponentWithProps, {
    y: ['asdf'],
  }, { assert: flip(assert) });

  comboTest(ComponentWithProps, {
    x: [1], y: [true],
  }, { assert: flip(assert) });

  comboTest(ComponentWithProps, {
    x: [0, 1, -1],
    y: [undefined, '', 'abc'],
  }, { assert });
});

test('Component Passing Props to children', assert => {
  assert.plan(3);

  comboTest(ComponentPassingPropsCorrectly, {
    x: [1],
  }, { assert });
  comboTest(ComponentPassingPropsBadly, {
    x: ['x'],
  }, { assert: flip(assert) });
  comboTest(ComponentWithoutPropsPassingPropsBadly, {
  }, { assert: flip(assert) });
});

test('Components that throw fail checking', assert => {
  assert.plan(1);
  comboTest(BrokenComponent, {}, { assert: flip(assert) });
});

test('coverage: more than one failing combo', assert => {
  assert.plan(1);
  comboTest(BrokenComponent, {
    x: [1, 2],
  }, { assert: flip(assert) });
});

test('Failing checks throw if assert is not provided', assert => {
  assert.plan(2);
  assert.doesNotThrow(() =>
    comboTest(ComponentWithoutProps, {})
    , 'Nothing explodes when checking succeeds without assert');

  assert.throws(() =>
    comboTest(ComponentWithProps, {})
    , 'Failing checks throw when assert is not provided');
});

test('Custom plain function assert', assert => {
  assert.plan(3);
  let result;
  const fnAssert = (ok, message) =>
    result = [ok, message]

  comboTest(ComponentWithoutProps, {}, {
    assert: fnAssert,
  });
  assert.deepEqual(result, [true, '<ComponentWithoutProps> passed 1 check']);

  comboTest(BrokenComponent, {}, {
    assert: fnAssert,
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

  comboTest(ComponentWithoutProps, {}, {
    assert: myAssert,
  });
  assert.deepEqual(passMessage, '<ComponentWithoutProps> passed 1 check');

  comboTest(BrokenComponent, {}, {
    assert: myAssert,
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

  comboTest(ComponentWithoutProps, {}, {
    assert: myAssert,
  });
  assert.deepEqual(message, '<ComponentWithoutProps> passed 1 check');
});


test('Skip invalid combos', assert => {
  assert.plan(1);

  comboTest(ComponentWithInvalidCombos, {
    mode: ['number', 'letter'],
    value: [1, 'a'],
  }, {
    assert,
    shouldSkipCombo: ({ mode, value }) =>
      (mode === 'number' && typeof value !== 'number') ||
      (mode === 'letter' && typeof value !== 'string'),
  });
});


test('Invariants are checked', assert => {
  assert.plan(2);
  let checked = false;

  comboTest(LabeledNumber, {
    label: ['', 'A', 'zed'],
    value: [-1, 0, 1],
  }, {
    assert,
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
  assert.throws(() => comboTest(undefined, {}));
});


test('Sample props must be provided', assert => {
  assert.plan(1);
  assert.throws(() => comboTest(ComponentWithoutProps));
});


test('Components are unmounted between combos', assert => {
  assert.plan(1);
  let mounted = false;
  class ThereCanOnlyBeOne extends Component {
    constructor(props) {
      super(props);
      if (mounted) throw new Error('ohH NOOOOOOOOOOOOOOOOooooooooooooo');
      mounted = true;
    }
    componentWillUnmount() {
      mounted = false;
    }
    render() {
      return null;
    }
  }
  assert.doesNotThrow(() => comboTest(ThereCanOnlyBeOne, {
    prop: [0, 1],
  }));
});
