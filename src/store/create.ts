import { getFromPath, setAtPath } from '@/utils/path';
import { ensureConfig } from './utils/ensureConfig';
import { log, getDebugMessage } from './utils/log';
import { ObservableProxy } from './ObservableProxy';
import type {
  TObservableLike,
  TObservableProxy,
} from './ObservableProxy/types';
import type { TOptionalStoreConfig, TState, TStore } from './types';
import { EffectManager } from './EffectManager';

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
      reset: () => {
        cloneAndSet(getFromPath(path, initialState));
        proxy.notify(getCloned(path));
      },

      getValue: () => getCloned(path),

      setValue: (value, logKey = 'set') => {
        const current = getFromPath(path, state);

        /* 1. Verify equality */
        if (utils.equals(current, value)) return;

        const previous = utils.clone(current);

        /* 2. Apply effects */
        const next = effects.apply(path, value, previous);

        /* 3. Save new value */
        cloneAndSet(next);

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
        Array.from(proxies.entries()).forEach(([p, ob]) => {
          if (p !== path && (path.startsWith(p) || p.startsWith(path))) {
            ob.notify(getCloned(p));
          }
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
    },

    get: () => {
      return utils.clone(state);
    },

    on: <T>(path: string): TObservableLike<T> => {
      const proxy = proxies.get(path) ?? createProxy(path);

      return proxy.observable as TObservableLike<T>;
    },

    reset: () => {
      state = utils.clone(initialState);
    },
  };

  return store;
};
