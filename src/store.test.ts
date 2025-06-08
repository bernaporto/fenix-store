import { describe, expect, it, vi } from 'vitest';
import { FenixStore } from './Store';

type TState = {
  user: {
    name: string;
    age?: number;
  };
};

/* README EXAMPLES */
describe('FenixStore', () => {
  it('should handle state changes', () => {
    const store = FenixStore.create<TState>();

    expect(store.get()).toEqual({});

    store.on('user.name').set('John Doe');

    expect(store.on('user.name').get()).toEqual('John Doe');
    expect(store.get()).toEqual({ user: { name: 'John Doe' } });
  });

  it('should handle subscriptions', () => {
    const store = FenixStore.create<TState>();

    const observer1 = vi.fn();
    const unsubscribe = store.on('user.name').subscribe(observer1, false);

    store.on('user.name').set('John Doe');
    expect(observer1).toHaveBeenLastCalledWith('John Doe');

    unsubscribe();

    store.on('user.name').set('Jane Doe');
    expect(observer1).toHaveBeenCalledTimes(1);
    expect(observer1).toHaveBeenLastCalledWith('John Doe');
  });

  it('should gracefully handle missing paths', () => {
    const store = FenixStore.create<TState>();

    store.on('user.name').set('John Doe');
    expect(store.on('user.name').get()).toEqual('John Doe');

    store.on('user.age').set(30);
    expect(store.on('user.age').get()).toEqual(30);
  });

  it('should gracefully handle equality checks', () => {
    const store = FenixStore.create<TState>();

    const observable = store.on('user.name');
    const observer1 = vi.fn();
    observable.subscribe(observer1, false);

    observable.set('John Doe');

    expect(observer1).toHaveBeenCalledTimes(1);
    expect(observer1).toHaveBeenLastCalledWith('John Doe');

    observable.set('John Doe');

    expect(observer1).toHaveBeenCalledTimes(1);
  });

  it('should apply effects (1)', () => {
    const store = FenixStore.create<TState>();

    store.effects.use((path, next) => {
      if (path !== 'user.name') return;

      return { next: `Hello, ${next}` };
    });

    const observer = vi.fn();
    store.on('user.name').subscribe(observer, false);

    store.on('user.name').set('John Doe');
    expect(observer).toHaveBeenCalledWith('Hello, John Doe');

    store.on('user.name').set('Jane Doe');
    expect(observer).toHaveBeenLastCalledWith('Hello, Jane Doe');
  });

  it('should apply effects (2)', () => {
    const store = FenixStore.create<TState>();
    const changeStack: unknown[] = [];

    store.effects.use((path, next, previous) => {
      changeStack.push({
        path,
        next,
        previous,
      });
    });

    store.on('user.name').set('John Doe');
    store.on('user.name').set('Jane Doe');

    expect(changeStack.at(-1)).toEqual({
      path: 'user.name',
      next: 'Jane Doe',
      previous: 'John Doe',
    });
  });

  it('should allow to clear effects', () => {
    const store = FenixStore.create<TState>();

    const effect = vi.fn();
    store.effects.use(effect);

    store.on('user.name').set('John Doe');
    expect(effect).toHaveBeenCalledTimes(1);

    store.effects.clear();

    store.on('user.name').set('Jane Doe');
    expect(effect).toHaveBeenCalledTimes(1);
  });
});
