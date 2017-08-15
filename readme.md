# React combo test

[![Build Status](https://travis-ci.org/ratehub/react-combo-test.svg?branch=master)](https://travis-ci.org/ratehub/react-combo-test)

Typecheck stateless component trees via [PropTypes](https://github.com/facebook/prop-types). You get weaker guarantees than real typechecking (eg., with [typescript](https://github.com/Microsoft/TypeScript-React-Starter#creating-a-component)), but it's easier to set up and maintain.

This library helps you gain confidence about two things:

1. For any valid props, a component renders without crashing
2. Any props it passes to its children are valid

The "any" claim for both points above is an over-reach -- we are just rendering with a bunch of valid props in different combinations. This is usually enough.

## Install

```bash
$ npm install --save-dev react-combo-test
```

## Usage

React combo test is currently test framework agnostic: it just throws to fail. For example, with [tape](https://github.com/substack/tape):

```js
import test from 'tape';
import comboTest from 'react-combo-test';
import MyComponent from '../wherever';

test('MyComponent renders without crashing', () =>
  comboTest(MyComponent, {
    colour: ['red', '#BAD', 'rgba(4, 3, 2, 1)'],
    interactive: [true, false, undefined],
  }));
```

In this case, `MyComponent` will be rendered nine times, checking every combination of the sample props (eg, `<MyComponent colour="red", interactive={true} />`, `<MyComponent colour="red" interactive={false} />`, ...).


**Gotcha: import `react-combo-test` before `react`.** This library patches react's render functionality in order to intercept proptype errors. To set that up, it needs to be imported before react is.


You can also pass your test framework's `assert` to `comboTest` for better failure reporting. Again with tape:

```js
import test from 'tape';
import comboTest from 'react-combo-test';
import MyComponent from '../wherever';

test('MyComponent renders without crashing', assert =>
  comboTest(MyComponent, {
    colour: ['red', '#BAD', 'rgba(4, 3, 2, 1)'],
    interactive: [true, false, undefined],
  }, {
    assert,
  }));
```


### Check rendered output

Many testable behaviours can be described as invariants that should hold given some props. Since React Combo Test is already generating lots of props for your component, a hook is provided to add extra checks called `check(jsx, invariant, props)`.

There are many ways to assert things about rendered JSX, so we just provide JSX and leave render/checking up to you. For example, with [enzyme's shallow renderer](http://airbnb.io/enzyme/docs/api/shallow.html):

```js
import comboTest from 'react-combo-test';
import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

const LabeledNumber = ({ label, value }) => (
  <p>
    {label && (
      <span className="label">{label}</span>
    )}
    {value}
  </p>
);

LabeledNumber.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};


comboTest(MyComponent, {
  label: ['', 'A', 'zed'],
  value: [-1, 0, 1],
}, {
  check: (jsx, invariant, props) => {
    const wrapper = shallow(jsx);
    const label = wrapper.find('.label');
    if (props.label.length) {
      invariant(label.exists(), 'A label is rendered when label is not empty');
    } else {
      invariant(!label.exists(), 'No label is rendered when label is empty');
    }
  },
});
```


### Skipping invalid prop combos

The best way to avoid bad states is to [make them unrepresentable](https://blogs.janestreet.com/effective-ml-revisited/) ([ahem](https://www.npmjs.com/package/results)), but sometimes you're stuck with legacy code where certain combinations of props are invalid and shouldn't be checked. React combo test has an escape hatch for this situation, `shouldSkipCombo(props)`:

```js
import comboTest from 'react-combo-test';


comboTest(AnnoyingComponent, {
  mode: ['numbers', 'letters'],
  value: [-1, 0, 1, 'A', 'Z', 'm'],
}, {
  shouldSkipCombo: ({ mode, value }) =>
    (mode === 'numbers' && typeof value !== 'number') ||
    (mode === 'letters' && typeof value !== 'String'),
});
```


## How it works

This library takes a naïve but useful approach that I should write more about in this section.


## History

In 2016, the original idea and code were implemented in [openride](https://openride.co)'s web app code. In 2017, [ratehub](https://ratehub.ca) sponsored extracting and refactoring it into this open-source library version.
