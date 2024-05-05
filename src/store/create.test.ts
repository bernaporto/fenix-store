import { Store } from '@/store';

describe('Store', () => {
  describe('create', () => {
    it('should be defined and be a function', () => {
      expect(Store.create).toBeDefined();
      expect(Store.create).toBeInstanceOf(Function);
    });

    it('should return a Store object', () => {
      const store = Store.create();

      expect(store).toBeInstanceOf(Object);
      expect(store).toHaveProperty('for');
      expect(store).toHaveProperty('get');
      expect(store).toHaveProperty('reset');
    });
  });

  describe('instance', () => {
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
  });
});
