# Fenix Store

## Lightweight • Reactive • Zero Dependencies • TypeScript

A tiny but powerful state management library for JavaScript applications. It provides a reactive API to manage the state of your application.

[![CI/CD Pipeline](https://github.com/team-fenix/fenix-store/actions/workflows/ci.yml/badge.svg)](https://github.com/team-fenix/fenix-store/actions/workflows/ci.yml)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-1.8kb%20gzipped-brightgreen)](#-bundle-analysis)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/team-fenix/fenix-store)

### Why?

After some years dealing with other complex solutions I decided to create this library with the following principles:

- **Reactive**: It allows you to subscribe to changes in the state of your application.
- **Simple**: It's designed to be simple and easy to use.
- **Flexible**: It allows you to create side effects and middleware to apply and listen to changes.
- **Lightweight**: It's small (1.8kb gzipped), with no dependencies.
- **Type-Safe**: Full TypeScript support with strict type checking.

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

## 🔧 Development

### Quick Start

```bash
# Install dependencies
pnpm install

# Run tests in watch mode
pnpm dev

# Build the library
pnpm build
```

### Quality Assurance

- ✅ TypeScript strict type checking
- ✅ ESLint code quality analysis
- ✅ Comprehensive test coverage
- ✅ Bundle size monitoring
- ✅ Security vulnerability scanning

### CI/CD Pipeline

The project uses GitHub Actions for:

- **Continuous Integration**: Automated testing on code pushes (Node.js 18, 20, 21)
- **Bundle Monitoring**: Size tracking and analysis
- **Quality Gates**: Code quality and security checks
- **Release Automation**: Streamlined publishing with bundle metrics

## 🤝 Contributing

This library is designed to be lightweight and focused, but contributions are welcome!

### Quick Start

```bash
pnpm install && pnpm dev    # Install deps + run tests in watch mode
```

### Before Submitting a PR

- Ensure tests pass: `pnpm test`
- Check bundle size impact: `pnpm size:check`
- Keep changes focused and well-documented

The CI pipeline will automatically validate code quality, run tests across multiple Node.js versions, and provide bundle size feedback.

---

## 📈 Project Status

This project follows a **stability-first approach** with careful consideration for changes to maintain its lightweight nature and zero-dependency philosophy.

- **Bundle Size**: 1.8KB gzipped (target: <3KB) ✅
- **Test Coverage**: Comprehensive test suite ✅
- **TypeScript**: Strict mode with full type safety ✅
- **Dependencies**: Zero runtime dependencies ✅
- **CI/CD**: Fully automated quality pipeline ✅

---

**License**: MIT
