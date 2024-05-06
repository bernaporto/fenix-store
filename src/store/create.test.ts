import { FenixStore } from '@/store';

describe('Store', () => {
  it('should notify the affected observable', () => {
    const store = FenixStore.create();
    const observable = store.on('key');

    const observer = jest.fn();

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
    const store = FenixStore.create({
      key1: {
        key2: 0,
      },
    });

    const observable1 = store.on('key1');
    const observable2 = store.on('key1.key2');

    const observer1 = jest.fn();
    const observer2 = jest.fn();

    observable1.subscribe(observer1);
    observable2.subscribe(observer2);

    observable1.set({ key2: 1 });

    expect(observer1).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
    expect(observable2.get()).toBe(1);
  });

  describe('dispose', () => {
    it('should clear all observables', () => {
      const store = FenixStore.create();
      const observable = store.on('key');

      const observer = jest.fn();

      observable.subscribe(observer);
      store.clear();

      observable.set(1);

      expect(observer).not.toHaveBeenCalled();
    });
  });

  describe('on', () => {
    it('should return an observable', () => {
      const store = FenixStore.create();
      const observable = store.on('key');

      expect(observable).toBeDefined();
      expect(observable).toHaveProperty('get');
      expect(observable).toHaveProperty('set');
      expect(observable).toHaveProperty('subscribe');
      expect(observable).toHaveProperty('update');
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
      const store = FenixStore.create({
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
  });

  describe('effects', () => {
    it('should apply the effects to the observable', () => {
      const store = FenixStore.create();

      const effect = jest.fn();
      store.effects.use(effect);

      const observable = store.on('key');

      observable.set(1);

      expect(effect).toHaveBeenCalled();
    });

    it('should apply effects return value to the observable', () => {
      const store = FenixStore.create();

      const effect = jest.fn((_, value) => ({ next: value + 1 }));
      store.effects.use(effect);

      const observable = store.on('key');

      observable.set(1);

      expect(observable.get()).toBe(2);
    });

    it('should apply effects in order', () => {
      const store = FenixStore.create();

      const effect1 = jest.fn((_, value) => ({ next: value + 1 }));
      store.effects.use(effect1);

      const effect2 = jest.fn((_, value) => ({ next: value.toFixed(2) }));
      store.effects.use(effect2);

      const observable = store.on('key');

      observable.set(1);

      expect(observable.get()).toBe('2.00');

      observable.set(2);

      expect(observable.get()).toBe('3.00');
    });

    it('should consider an undefined value as a valid result', () => {
      const store = FenixStore.create();

      const effect = jest.fn(() => ({ next: undefined }));
      store.effects.use(effect);

      const observable = store.on('key');

      observable.set(1);

      expect(observable.get()).toBeUndefined();
    });
  });

  describe('config.debug', () => {
    beforeAll(() => {
      jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterAll(() => {
      jest.restoreAllMocks();
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
        expect.any(String)
      );
    });
  });
});
