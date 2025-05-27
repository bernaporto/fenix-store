# Fenix Store

## Lightweight (3kb) • Reactive • Zero Dependencies

A tiny but powerful state management library for JavaScript applications. It provides a reactive API to manage the state of your application.

### Why?

After some years dealing with other complex solutions I decided to create this library with the following principles:

- **Reactive**: It allows you to subscribe to changes in the state of your application.
- **Simple**: It's designed to be simple and easy to use.
- **Flexible**: It allows you to create side effects and middleware to apply and listen to changes.
- **Lightweight**: It's small, with no dependencies.

## Installation

Install with npm:

```bash
  npm install fenix-store
```

or with yarn:

```bash
  yarn add fenix-store
```

## Usage

```javascript
import { FenixStore } from 'fenix-store';

const store = FenixStore.create();
console.log(store.get());
// {}

store.on('user.name').set('John Doe');

console.log(store.on('user.name').get());
// 'John Doe'

console.log(store.get());
// { user: { name: 'John Doe' } }
```

#### Subscribe / Unsubscribe:

```javascript
...

const unsubscribe = store
  .on('user.name')
  .subscribe(console.log);

store
  .on('user.name')
  .set('John Doe'); // 'John Doe'

unsubscribe();

store
  .on('user.name')
  .set('Jane Doe'); // nothing
```

#### Side Effects / Middleware

```javascript
...

store
  .effects
  .use(
    // Return an object with the 'next' property to change the value, otherwise no changes will be applied.
    (path, next) => {
      if (path !== 'user.name') return;

      return { next: `Hello, ${next}` };
    },
  )

store
  .on('user.name')
  .subscribe(console.log);

store
  .on('user.name')
  .set('John Doe');
  // 'Hello, John Doe'

store
  .on('user.name')
  .set('Jane Doe');
  // 'Hello, Jane Doe'
```

```javascript
...

const changeStack = [];

store
  .effects
  .use(
    (path, next, previous) => {
      changeStack.push({
        path,
        next,
        previous,
      });
    },
  );

store
  .on('user.name')
  .set('John Doe');

store
  .on('user.name')
  .set('Jane Doe');

console.log(changeStack.at(-1));
// { path: 'user.name', next: 'Jane Doe', previous: 'John Doe' }
```
