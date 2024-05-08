import { FenixStore } from './store';

/* README EXAMPLES */
describe('FenixStore', () => {
  it('should handle state changes', () => {
    const store = FenixStore.create();

    expect(store.get()).toEqual({});

    store.on('user.name').set('John Doe');

    expect(store.on('user.name').get()).toEqual('John Doe');
    expect(store.get()).toEqual({ user: { name: 'John Doe' } });
  });

  it('should handle subscriptions', () => {
    const store = FenixStore.create();

    const observer1 = jest.fn();
    const unsubscribe = store.on('user.name').subscribe(observer1);

    const observer2 = jest.fn();
    store.on('user.name').subscribe(observer2);

    store.on('user.name').set('John Doe');
    expect(observer1).toHaveBeenLastCalledWith('John Doe', undefined);

    unsubscribe();

    store.on('user.name').set('Jane Doe');
    expect(observer1).toHaveBeenCalledTimes(2);
    expect(observer1).toHaveBeenLastCalledWith('John Doe', undefined);
  });

  it('should apply effects (1)', () => {
    const store = FenixStore.create();

    store.effects.use((path, next) => {
      if (path !== 'user.name') return;

      return { next: `Hello, ${next}` };
    });

    const observer = jest.fn();
    store.on('user.name').subscribe(observer);

    store.on('user.name').set('John Doe');
    expect(observer).toHaveBeenCalledWith('Hello, John Doe', undefined);

    store.on('user.name').set('Jane Doe');
    expect(observer).toHaveBeenCalledWith('Hello, Jane Doe', 'Hello, John Doe');
  });

  it('should apply effects (2)', () => {
    const store = FenixStore.create();
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
});
