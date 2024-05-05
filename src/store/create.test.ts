import { Store } from '@/store';

describe('Store', () => {
  describe('dispose', () => {
    it('should clear all observables', () => {
      const store = Store.create();
      const observable = store.for('key');

      const observer = jest.fn();

      observable.subscribe(observer);
      store.clear();

      observable.set(1);

      expect(observer).not.toHaveBeenCalled();
    });
  });

  describe('for', () => {
    it('should return an observable', () => {
      const store = Store.create();
      const observable = store.for('key');

      expect(observable).toBeDefined();
      expect(observable).toHaveProperty('get');
      expect(observable).toHaveProperty('set');
      expect(observable).toHaveProperty('subscribe');
      expect(observable).toHaveProperty('update');
    });
  });

  describe('get', () => {
    it('should return the current state', () => {
      const store = Store.create();

      expect(store.get()).toEqual({});

      store.for('key').set(1);

      expect(store.get()).toEqual({ key: 1 });
    });
  });

  describe('reset', () => {
    it('should reset the state to its initial value', () => {
      const store = Store.create({
        key1: 0,
        key2: {
          key3: 0,
        },
      });

      store.for('key1').set(1);
      store.for('key2').set(undefined);

      store.reset();

      expect(store.get()).toEqual({
        key1: 0,
        key2: {
          key3: 0,
        },
      });
    });
  });

  describe('effects', () => {
    it('should apply the effects to the observable', () => {
      const effect = jest.fn();
      const store = Store.create(undefined, {
        effects: [effect],
      });

      const observable = store.for('key');

      observable.set(1);

      expect(effect).toHaveBeenCalled();
    });

    it('should apply effects return value to the observable', () => {
      const effect = jest.fn((_, value) => ({ next: value + 1 }));
      const store = Store.create(undefined, {
        effects: [effect],
      });

      const observable = store.for('key');

      observable.set(1);

      expect(observable.get()).toBe(2);
    });

    it('should apply effects in order', () => {
      const effect1 = jest.fn((_, value) => ({ next: value + 1 }));
      const effect2 = jest.fn((_, value) => ({ next: value.toFixed(2) }));
      const store = Store.create(undefined, {
        effects: [effect1, effect2],
      });

      const observable = store.for('key');

      observable.set(1);

      expect(observable.get()).toBe('2.00');

      observable.set(2);

      expect(observable.get()).toBe('3.00');
    });

    it('should consider an undefined value as a valid result', () => {
      const effect = jest.fn(() => ({ next: undefined }));
      const store = Store.create(undefined, {
        effects: [effect],
      });

      const observable = store.for('key');

      observable.set(1);

      expect(observable.get()).toBeUndefined();
    });
  });

  it('should notify the affected observable', () => {
    const store = Store.create();
    const observable = store.for('key');

    const observer = jest.fn();

    observable.subscribe(observer);

    observable.set(1);

    expect(observer).toHaveBeenCalled();
    expect(observable.get()).toBe(1);
  });

  it('should notify all affected parent paths', () => {
    const store = Store.create({
      key1: {
        key2: 0,
      },
    });

    const observable1 = store.for('key1');
    const observable2 = store.for('key1.key2');

    const observer1 = jest.fn();
    const observer2 = jest.fn();

    observable1.subscribe(observer1);
    observable2.subscribe(observer2);

    observable2.set(1);

    expect(observer2).toHaveBeenCalled();
    expect(observer1).toHaveBeenCalled();
    expect(observable1.get()).toEqual({ key2: 1 });
  });

  it('should notify all affected child paths', () => {
    const store = Store.create({
      key1: {
        key2: 0,
      },
    });

    const observable1 = store.for('key1');
    const observable2 = store.for('key1.key2');

    const observer1 = jest.fn();
    const observer2 = jest.fn();

    observable1.subscribe(observer1);
    observable2.subscribe(observer2);

    observable1.set({ key2: 1 });

    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
    expect(observable2.get()).toBe(1);
  });
});
