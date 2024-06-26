import { clone } from '../utils/clone';
import { equals } from '../utils/equals';
import { observable } from './observable';
import { TObservableConfig } from './types';

const noop = () => {
  /* noop */
};
const config = <T>(initialValue?: T): TObservableConfig<T> => ({
  initialValue,
  applyEffects: (next) => next,
  onChange: noop,
  utils: {
    clone,
    equals,
  },
});

describe('observable', () => {
  it('should be defined', () => {
    const ob = observable(config());

    expect(ob).toBeDefined();
  });

  it('should return an object with get, set, subscribe and update methods', () => {
    const ob = observable(config());

    expect(ob).toHaveProperty('get');
    expect(ob).toHaveProperty('set');
    expect(ob).toHaveProperty('subscribe');
    expect(ob).toHaveProperty('update');
  });

  it('should have initial value as undefined by default', () => {
    const ob = observable(config());

    expect(ob.get()).toBe(undefined);
  });

  describe('get', () => {
    it('should return the current value', () => {
      const ob = observable(config(1));

      expect(ob.get()).toBe(1);

      ob.set(2);

      expect(ob.get()).toBe(2);
    });
  });

  describe('reset', () => {
    it('should reset the state to the initial value', () => {
      const ob = observable(config(1));

      ob.set(2);
      expect(ob.get()).toBe(2);

      ob.reset();
      expect(ob.get()).toBe(1);
    });
  });

  describe('set', () => {
    it('should set a new value', () => {
      const ob = observable(config(1));

      ob.set(2);

      expect(ob.get()).toBe(2);
    });

    it('should notify subscribers', () => {
      const ob = observable(config(1));

      const observer = jest.fn();

      ob.subscribe(observer);

      ob.set(2);

      expect(observer).toHaveBeenLastCalledWith(2, 1);
    });

    it('should not notify subscribers if the value is the same', () => {
      const ob = observable(config(1));

      const observer = jest.fn();

      ob.subscribe(observer);

      ob.set(1);

      expect(observer).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribe', () => {
    it('should return a function to unsubscribe', () => {
      const ob = observable(config(1));

      const observer = jest.fn();

      const unsubscribe = ob.subscribe(observer);

      ob.set(2);

      unsubscribe();

      ob.set(3);

      expect(observer).toHaveBeenCalledTimes(2);
    });

    it('should notify immediately with second parameter as true', () => {
      const ob = observable(config(1));

      const observer = jest.fn();

      ob.subscribe(observer, true);

      expect(observer).toHaveBeenLastCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update the value with an updater function', () => {
      const ob = observable(config(1));

      ob.update((value) => value + 1);

      expect(ob.get()).toBe(2);
    });
  });

  describe('observers', () => {
    describe('count', () => {
      it('should return the number of observers', () => {
        const ob = observable(config(1));

        const observer1 = jest.fn();
        const observer2 = jest.fn();

        ob.subscribe(observer1);
        ob.subscribe(observer2);

        expect(ob.observers.count).toBe(2);
      });
    });

    describe('clear', () => {
      it('should clear all observers', () => {
        const ob = observable(config(1));

        const observer = jest.fn();

        ob.subscribe(observer);
        ob.observers.clear();

        ob.set(2);

        expect(observer).toHaveBeenCalledTimes(1);
      });
    });

    describe('remove', () => {
      it('should remove a specific observer', () => {
        const ob = observable(config(1));

        const observer1 = jest.fn();
        const observer2 = jest.fn();

        ob.subscribe(observer1);
        ob.subscribe(observer2);

        ob.observers.remove(observer1);

        ob.set(2);

        expect(ob.observers.count).toBe(1);
        expect(observer1).toHaveBeenCalledTimes(1);
        expect(observer2).toHaveBeenCalledTimes(2);
      });
    });
  });
});
