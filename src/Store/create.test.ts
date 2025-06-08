import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { FenixStore } from './index';

describe('Store', () => {
  it('should notify the affected observable', () => {
    const store = FenixStore.create();
    const observable = store.on('key');

    const observer = vi.fn();

    observable.subscribe(observer);

    observable.set(1);

    expect(observer).toHaveBeenCalled();
    expect(observable.get()).toBe(1);
  });

  it('should notify all affected parent paths', () => {
    const store = FenixStore.create({
      key1: {
        key2: 0,
      },
    });

    const observable1 = store.on('key1');
    const observable2 = store.on('key1.key2');

    const observer1 = vi.fn();
    const observer2 = vi.fn();

    observable1.subscribe(observer1, false);
    observable2.subscribe(observer2, false);

    observable2.set(1);

    expect(observer2).toHaveBeenCalled();
    expect(observer1).toHaveBeenCalled();
    expect(observable1.get()).toEqual({ key2: 1 });
  });

  it('should notify all affected child paths', () => {
    const store = FenixStore.create({
      key1: {
        key2: 0,
      },
    });

    const observable1 = store.on('key1');
    const observable2 = store.on('key1.key2');

    const observer1 = vi.fn();
    const observer2 = vi.fn();

    observable1.subscribe(observer1, false);
    observable2.subscribe(observer2, false);

    observable1.set({ key2: 1 });

    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
    expect(observable2.get()).toBe(1);
  });

  describe('clear', () => {
    it('should clear all observables', () => {
      const store = FenixStore.create();
      const observable = store.on('key');

      const observer = vi.fn();

      observable.subscribe(observer, false);
      expect(observer).not.toHaveBeenCalled();

      store.clear();
      observable.set(1);

      expect(observer).not.toHaveBeenCalled();
    });
  });

  describe('on', () => {
    it('should return an observable', () => {
      const store = FenixStore.create<{ key: number }>();
      const observable = store.on('key');

      expect(observable).toBeDefined();
      expect(observable).toHaveProperty('get');
      expect(observable).toHaveProperty('set');
      expect(observable).toHaveProperty('subscribe');
      expect(observable).toHaveProperty('update');

      const observer = vi.fn();
      const unsubscribe = observable.subscribe(observer, false);

      observable.set(1);
      expect(observable.get()).toBe(1);

      observable.update((value) => value + 1);
      expect(observable.get()).toBe(2);

      expect(observer).toHaveBeenCalledTimes(2);
      unsubscribe();

      observable.reset();
      expect(observable.get()).toBeUndefined();

      expect(observer).toHaveBeenCalledTimes(2);
    });
  });

  describe('get', () => {
    it('should return the current state', () => {
      const store = FenixStore.create();

      expect(store.get()).toEqual({});

      store.on('key').set(1);

      expect(store.get()).toEqual({ key: 1 });
    });
  });

  describe('reset', () => {
    it('should reset the state to its initial value', () => {
      const store = FenixStore.create<{
        key1: number;
        key2?: {
          key3: number;
        };
      }>({
        key1: 0,
        key2: {
          key3: 0,
        },
      });

      store.on('key1').set(1);
      store.on('key2').set(undefined);

      store.reset();

      expect(store.get()).toEqual({
        key1: 0,
        key2: {
          key3: 0,
        },
      });
    });

    it('should notify all affected observables', () => {
      const store = FenixStore.create<{
        key1: number;
        key2: {
          key3: number;
          key4?: string;
        };
      }>({
        key1: 0,
        key2: {
          key3: 0,
        },
      });

      const observable1 = store.on('key1');
      const observable2 = store.on('key2');
      const observable3 = store.on('key2.key3');
      const observable4 = store.on('key2.key4');

      observable3.set(1);
      observable4.set('test');

      const observer1 = vi.fn();
      const observer2 = vi.fn();
      const observer3 = vi.fn();
      const observer4 = vi.fn();

      observable1.subscribe(observer1, false);
      observable2.subscribe(observer2, false);
      observable3.subscribe(observer3, false);
      observable4.subscribe(observer4, false);

      store.reset();

      expect(observer1).not.toHaveBeenCalled();
      expect(observer2).toHaveBeenCalled();
      expect(observer2).toHaveBeenLastCalledWith({ key3: 0 });
      expect(observer3).toHaveBeenCalled();
      expect(observer3).toHaveBeenLastCalledWith(0);
      expect(observer4).toHaveBeenCalled();
      expect(observer4).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe('effects', () => {
    it('should apply the effects to the observable', () => {
      const store = FenixStore.create();

      const effect = vi.fn();
      store.effects.use(effect);

      store.on('key').set(1);

      expect(effect).toHaveBeenCalled();
    });

    it('should apply effects return value to the observable', () => {
      const store = FenixStore.create();

      const effect = vi.fn((_, value) => ({ next: value + 1 }));
      store.effects.use(effect);

      const observable = store.on('key');
      observable.set(1);

      expect(observable.get()).toBe(2);
    });

    it('should apply effects in order', () => {
      const store = FenixStore.create();

      const effect1 = vi.fn((_, value) => ({ next: value + 1 }));
      store.effects.use(effect1);

      const effect2 = vi.fn((_, value) => ({ next: value.toFixed(2) }));
      store.effects.use(effect2);

      const observable = store.on('key');

      observable.set(1);

      expect(observable.get()).toBe('2.00');

      observable.set(2);

      expect(observable.get()).toBe('3.00');
    });

    it('should consider an undefined value as a valid result', () => {
      const store = FenixStore.create();

      const effect = vi.fn(() => ({ next: undefined }));
      store.effects.use(effect);

      const observable = store.on('key');

      observable.set(1);

      expect(observable.get()).toBeUndefined();
    });

    it('should handle errors in effects gracefully', () => {
      const store = FenixStore.create();
      const effect = vi.fn(() => {
        throw new Error('Test error');
      });
      store.effects.use(effect);

      const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const observable = store.on('key');

      expect(() => observable.set(1)).not.toThrow();
      expect(observable.get()).toBe(1);
      expect(effect).toHaveBeenCalled();

      warnMock.mockRestore();
    });
  });

  describe('config.debug', () => {
    beforeAll(() => {
      vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it('should log the changes', () => {
      const store = FenixStore.create(undefined, {
        debug: true,
        debugKey: 'Store Test',
      });

      const observable = store.on('key');

      observable.set(1);

      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
      expect(console.groupCollapsed).toHaveBeenCalledWith(
        expect.stringContaining('[Store Test] store.set'),
        expect.any(String),
        expect.any(String),
      );
    });
  });
});
