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
import ComboTest from 'react-combo-test';
import MyComponent from '../wherever';

test('MyComponent renders without crashing', () =>
  ComboTest(MyComponent, {
    props: {
      colour: ['red', '#BAD', 'rgba(4, 3, 2, 1)'],
      interactive: [true, false, undefined],
    },
  }));
```

In this case, `MyComponent` will be shallow-rendered nine times, checking every combination of the sample props (eg, `<MyComponent colour="red", interactive={true} />`, `<MyComponent colour="red" interactive={false} />`, ...).

You can also pass your test framework's `assert` to `ComboTest` for better failure reporting. Again with tape:

```js
import test from 'tape';
import ComboTest from 'react-combo-test';
import MyComponent from '../wherever';

test('MyComponent renders without crashing', assert =>
  ComboTest(MyComponent, {
    assert,
    props: {
      colour: ['red', '#BAD', 'rgba(4, 3, 2, 1)'],
      interactive: [true, false, undefined],
    },
  }));
```

Planned stuff:

- allow "skips": a callback accepting the prop combo that returns true if the component shouldn't be checked with this combination. Needing it points to a deeper data-modeling problem, but who doesn't have those.
- allow "invariants": a callback that accepts the provided props and asserts stuff about the rendered JSX. There are a bunch of existing testing tools for the assertion side of this that will hopefully be compatible.

Possibly useful features to consider:

- add context combos
- collect extra prop combos for components by walking shallow-render trees and saving the provided props

## How it works

This library takes a naïve but useful approach that I should write more about in this section.

## History

The code for this project originated inside [openride](https://openride.co)'s web app before [ratehub](https://ratehub.ca) sponsored its liberation into this open-source library version.
