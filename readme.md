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
    props: {
      colour: ['red', '#BAD', 'rgba(4, 3, 2, 1)'],
      interactive: [true, false, undefined],
    },
  }));
```

In this case, `MyComponent` will be shallow-rendered nine times, checking every combination of the sample props (eg, `<MyComponent colour="red", interactive={true} />`, `<MyComponent colour="red" interactive={false} />`, ...).

You can also pass your test framework's `assert` to `comboTest` for better failure reporting. Again with tape:

```js
import test from 'tape';
import comboTest from 'react-combo-test';
import MyComponent from '../wherever';

test('MyComponent renders without crashing', assert =>
  comboTest(MyComponent, {
    assert,
    props: {
      colour: ['red', '#BAD', 'rgba(4, 3, 2, 1)'],
      interactive: [true, false, undefined],
    },
  }));
```

### Skips

The best way to avoid bad states is to [make them unrepresentable](https://blogs.janestreet.com/effective-ml-revisited/) ([ahem](https://www.npmjs.com/package/results)), but sometimes you're stuck with legacy code where certain combinations of props are invalid and shouldn't be checked. React combo test has an escape hatch for this situation, `shouldSkipCombo(props)`:

```js
import comboTest from 'react-combo-test';


comboTest(AnnoyingComponent, {
  props: {
    mode: ['numbers', 'letters'],
    value: [-1, 0, 1, 'A', 'Z', 'm'],
  },
  shouldSkipCombo: ({ mode, value }) =>
    (mode === 'numbers' && typeof value !== 'number') ||
    (mode === 'letters' && typeof value !== 'String'),
});
```


## Planned stuff

- allow "invariants": a callback that accepts the provided props and asserts stuff about the rendered JSX. There are a bunch of existing testing tools for the assertion side of this that will hopefully be compatible.


## How it works

This library takes a naïve but useful approach that I should write more about in this section.

## History

The code for this project originated inside [openride](https://openride.co)'s web app before [ratehub](https://ratehub.ca) sponsored its liberation into this open-source library version.
