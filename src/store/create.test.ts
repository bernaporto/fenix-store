import { Store } from '@/store';

describe('Store', () => {
  describe('dispose', () => {
    it('should clear all observables', () => {
      const store = Store.create();
      const observable = store.for('key');

      const observer = jest.fn();

      observable.subscribe(observer);
      store.dispose();

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

    it('should return the same observable for the same key', () => {
      const store = Store.create();
      const observable1 = store.for('key');
      const observable2 = store.for('key');

      expect(observable1).toBe(observable2);
    });

    it('should return different observables for different keys', () => {
      const store = Store.create();
      const observable1 = store.for('key1');
      const observable2 = store.for('key2');

      expect(observable1).not.toBe(observable2);
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
    it('should reset the state to its initial state', () => {
      const store = Store.create({
        key1: 0,
      });

      store.for('key1').set(1);
      store.for('key2').set(2);

      store.reset();

      expect(store.get()).toEqual({
        key1: 0,
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
  });

  it('should apply effects return value to the observable', () => {
    const effect = jest.fn((_, next) => next + 1);
    const store = Store.create(undefined, {
      effects: [effect],
    });

    const observable = store.for('key');

    observable.set(1);

    expect(observable.get()).toBe(2);
  });

  it('should apply effects in order', () => {
    const effect1 = jest.fn((_, next) => next + 1);
    const effect2 = jest.fn((_, next) => next.toFixed(2));
    const store = Store.create(undefined, {
      effects: [effect1, effect2],
    });

    const observable = store.for('key');

    observable.set(1);

    expect(observable.get()).toBe('2.00');

    observable.set(2);

    expect(observable.get()).toBe('3.00');
  });
});
