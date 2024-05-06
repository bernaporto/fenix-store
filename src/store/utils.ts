import { deletePath, getFromPath, setAtPath } from '@/utils/path';
import { observable, type TObservable } from '@/observable';
import type { TObProxyContainer, TState, TStoreConfig } from './types';

export const setupObservable = (
  path: string,
  state: TState,
  obMap: Map<string, TObProxyContainer>,
  config: TStoreConfig
): TObProxyContainer => {
  const initialValue = getFromPath(path, state);
  const ob = observable(initialValue, config.utils);
  const originalReset = ob.reset;

  ob.reset = () => {
    originalReset();
    setAtPath(path, ob.get(), state);
  };

  return {
    original: ob,
    proxy: toStoreOb(ob, path, state, obMap, config),
  };
};

const toStoreOb = (
  ob: TObservable<unknown>,
  path: string,
  state: TState,
  obMap: Map<string, TObProxyContainer>,
  config: TStoreConfig
) => {
  const { debug, debugKey, utils } = config;

  return {
    get: ob.get,
    reset: ob.reset,
    subscribe: ob.subscribe,
    update: ob.update,

    set: (value: unknown, logKey = 'set') => {
      const previous = ob.get();
      const next = applyEffects(path, value, previous, config);
      ob.set(next);

      if (next === undefined) {
        deletePath(path, state);
      } else {
        setAtPath(path, ob.get(), state);
      }

      // update all observables that are affected by this change
      Array.from(obMap.keys())
        .filter((p) => p !== path && (path.startsWith(p) || p.startsWith(path)))
        .forEach((p) => {
          obMap.get(p)?.original.set(getFromPath(p, state));
        });

      if (debug) {
        log({
          path,
          baseMsg: getDebugMessage(`store.${logKey}`, debugKey),
          newValue: ob.get(),
          oldValue: utils.clone(previous),
          observers: ob.observers.count,
        });
      }
    },
  };
};

const applyEffects = (
  path: string,
  next: unknown,
  previous: unknown,
  config: TStoreConfig
) => {
  const { effects, utils } = config;

  if (effects.length === 0) return next;

  return effects.reduce<unknown>(
    (acc, effect) => {
      const result = effect(path, utils.clone(acc), utils.clone(previous));

      if (result === undefined) {
        return acc;
      }

      return result.next;
    },

    next
  );
};

/* DEBUG */
export const log = ({
  baseMsg,
  path,
  newValue,
  oldValue,
  observers,
}: {
  baseMsg: string;
  path: string;
  newValue: unknown;
  oldValue: unknown;
  observers: number;
}) => {
  console.groupCollapsed(
    `${baseMsg}( %c${path}`,
    'font-weight: 400; color: #cccc00;',
    ')'
  );
  console.table({
    previous: {
      value: oldValue,
    },
    next: {
      value: newValue,
    },
    observers: {
      count: observers,
    },
  });
  console.log(`%ccalled ${getCaller()}`, `color: #909090;`);
  console.groupEnd();
};

const getCaller = () => {
  const stack = (new Error().stack ?? '').split('\n');
  const caller =
    stack.find((line, index) => {
      if (index === 0) return false;
      return !line.includes('store');
    }) ?? '';

  return caller.trim();
};

const getDebugMessage = (action: string, key?: string) => {
  return [key && `[${key}]`, action].filter(Boolean).join(' ');
};
