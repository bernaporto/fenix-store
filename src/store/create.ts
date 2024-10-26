import { deleteAtPath, getFromPath, setAtPath } from '@/tools';
import { EffectManager } from './EffectManager';
import {
  ensureConfig,
  getDebugMessage,
  isRelatedTo,
  log,
  sortByPathLength,
} from './utils';
import { ObservableProxy } from './ObservableProxy';
import type {
  TObservableLike,
  TObservableProxy,
} from './ObservableProxy/types';
import type { TOptionalStoreConfig, TState, TStore } from './types';

export const create = <T extends TState = TState>(
  initialValue: T = Object.create(null),
  config?: TOptionalStoreConfig,
): TStore<T> => {
  const _config = ensureConfig(config);
  const utils = _config.utils;

  const proxies = new Map<string, TObservableProxy<unknown>>();
  const effects = EffectManager.create(utils);

  const initialState = utils.clone(initialValue);
  let state = utils.clone(initialValue);

  const createProxy = (path: string) => {
    const cloneAndSet = (next: unknown) => {
      setAtPath(path, utils.clone(next), state);
    };

    const getCloned = (p: string) => {
      return utils.clone(getFromPath(p, state));
    };

    const proxy = ObservableProxy.create({
      initialValue: getFromPath(path, initialState),

      getValue: () => getCloned(path),

      setValue: (value, logKey = 'set') => {
        const current = getFromPath(path, state);

        /* 1. Verify equality */
        if (utils.equals(current, value)) return;

        const previous = utils.clone(current);

        /* 2. Apply effects */
        const next = effects.apply(path, value, previous);

        /* 3. Save new value */
        if (next === undefined) deleteAtPath(path, state);
        else cloneAndSet(next);

        /* 4. Log */
        if (_config.debug) {
          log({
            path,
            observers: proxy.observers.size,
            baseMsg: getDebugMessage(`store.${logKey}`, _config.debugKey),
            next: utils.clone(next),
            previous: utils.clone(previous),
          });
        }

        /* 5. Notify observers */
        proxy.notify(getCloned(path));

        /* 6. Notify other affected observables */
        Array.from(proxies.entries())
          .filter(isRelatedTo(path))
          .sort(sortByPathLength)
          .forEach(([p, ob]) => {
            ob.notify(getCloned(p));
          });
      },
    });

    proxies.set(path, proxy);

    return proxy;
  };

  const store: TStore<T> = {
    effects: effects.handler,

    clear: () => {
      proxies.forEach((proxy) => proxy.observers.clear());
      proxies.clear();
    },

    get: () => {
      return utils.clone(state);
    },

    on: <T>(path: string): TObservableLike<T> => {
      const proxy = proxies.get(path) ?? createProxy(path);

      return proxy.observable as TObservableLike<T>;
    },

    reset: () => {
      // 1. Reset all state to its initial value
      state = utils.clone(initialState);

      // 2. cleanup unused proxies
      Array.from(proxies.entries()).forEach(([path, proxy]) => {
        if (proxy.observers.size === 0) {
          proxies.delete(path);
        }
      });

      // 3. Reset all valid observables to trigger their observers
      Array.from(proxies.entries())
        // 3.1. Sort by path length to reset children first
        .sort(sortByPathLength)
        .forEach(([, proxy]) => proxy.observable.reset());
    },
  };

  return store;
};
