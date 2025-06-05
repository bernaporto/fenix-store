import { deleteAtPath, getFromPath, parsePath, setAtPath } from '@/tools';
import { EffectManager } from './EffectManager';
import {
  ensureConfig,
  getDebugMessage,
  isRelatedTo,
  log,
  sortByPathLength,
} from './utils';
import { ObservableController } from './ObservableController';
import type { TObservableLike } from './ObservableController/types';
import type { TCacheItem, TOptionalStoreConfig, TState, TStore } from './types';

export const create = <T extends TState = TState>(
  initialValue: T = Object.create(null),
  config?: TOptionalStoreConfig,
): TStore<T> => {
  const _config = ensureConfig(config);
  const utils = _config.utils;

  const cache = new Map<string, TCacheItem>();
  const effects = EffectManager.create(utils);

  const initialState = utils.clone(initialValue);
  let state = utils.clone(initialValue);

  const createController = (path: string) => {
    const parsedPath = parsePath(path);

    const cloneAndSet = (next: unknown) => {
      setAtPath(parsedPath, utils.clone(next), state);
    };

    const getCloned = (keys: string[]) => {
      return utils.clone(getFromPath(keys, state));
    };

    const controller = ObservableController.create({
      initialValue: getFromPath(parsedPath, initialState),

      getValue: () => getCloned(parsedPath),

      setValue: (value, logKey = 'set') => {
        const current = getFromPath(parsedPath, state);

        /* 1. Verify equality */
        if (utils.equals(current, value)) return;

        const previous = utils.clone(current);

        /* 2. Apply effects */
        const next = effects.apply(path, value, previous);

        /* 3. Save new value */
        if (next === undefined) deleteAtPath(parsedPath, state);
        else cloneAndSet(next);

        /* 4. Log */
        if (_config.debug) {
          log({
            path,
            observers: controller.observers.size,
            baseMsg: getDebugMessage(`store.${logKey}`, _config.debugKey),
            next: utils.clone(next),
            previous: utils.clone(previous),
          });
        }

        /* 5. Notify observers */
        controller.notify(getCloned(parsedPath));

        /* 6. Notify other affected observables */
        Array.from(cache.entries())
          .filter(isRelatedTo(path))
          .sort(sortByPathLength)
          .forEach(([, { controller, parsedPath }]) => {
            controller.notify(getCloned(parsedPath));
          });
      },
    });

    cache.set(path, { controller, parsedPath });

    return controller;
  };

  const store: TStore<T> = {
    effects: effects.handler,

    clear: () => {
      cache.forEach(({ controller }) => controller.observers.clear());
      cache.clear();
    },

    get: () => {
      return utils.clone(state);
    },

    on: <T>(path: string): TObservableLike<T> => {
      const c = cache.get(path)?.controller ?? createController(path);

      return c.observable as TObservableLike<T>;
    },

    reset: () => {
      // 1. Reset all state to its initial value
      state = utils.clone(initialState);

      // 2. cleanup unused proxies
      Array.from(cache.entries()).forEach(([path, { controller }]) => {
        if (controller.observers.size === 0) {
          cache.delete(path);
        }
      });

      // 3. Reset all valid observables to trigger their observers
      Array.from(cache.entries())
        // 3.1. Sort by path length to reset children first
        .sort(sortByPathLength)
        .forEach(([, { controller }]) => controller.observable.reset());
    },
  };

  return store;
};
