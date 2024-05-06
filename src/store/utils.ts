import { deletePath, getFromPath, setAtPath } from '@/utils/path';
import { isNotNullable } from '@/utils/nullable';
import { observable } from '@/observable';
import type {
  TExtendedEffectManager,
  TObProxyContainer,
  TState,
  TStoreConfig,
} from './types';

export const setupObservable = (
  path: string,
  state: TState,
  obMap: Map<string, TObProxyContainer>,
  config: TStoreConfig,
  effects: TExtendedEffectManager
): TObProxyContainer => {
  const initialValue = getFromPath(path, state);
  const ob = observable(initialValue, config.utils);

  const proxy = {
    get: ob.get,
    observers: ob.observers,
    subscribe: ob.subscribe,

    reset: () => {
      proxy.set(initialValue, 'reset');
      setAtPath(path, proxy.get(), state);
    },

    set: (value: unknown, logKey = 'set') => {
      const previous = ob.get();
      const next = applyEffects(path, value, previous, config, effects);
      ob.set(next);

      if (next === undefined) {
        deletePath(path, state);
      } else {
        setAtPath(path, ob.get(), state);
      }

      // Update all observables that are affected by this change
      Array.from(obMap.keys())
        .filter((p) => p !== path && (path.startsWith(p) || p.startsWith(path)))
        .forEach((p) => {
          obMap.get(p)?.original.set(getFromPath(p, state));
        });

      if (config.debug) {
        log({
          path,
          baseMsg: getDebugMessage(`store.${logKey}`, config.debugKey),
          newValue: ob.get(),
          oldValue: config.utils.clone(previous),
          observers: ob.observers.count,
        });
      }
    },

    update: <T>(updater: (value: Readonly<T>) => T) => {
      const next = updater(proxy.get() as T);
      proxy.set(next, 'update');
    },
  };

  return {
    proxy,
    original: ob,
  };
};

/* EFFECTS */
const applyEffects = (
  path: string,
  next: unknown,
  previous: unknown,
  config: TStoreConfig,
  effects: TExtendedEffectManager
) => {
  const { utils } = config;
  const effectList = effects.list();

  if (effectList.length === 0) return next;

  return effectList.reduce<unknown>(
    (acc, effect) => {
      const result = effect(path, utils.clone(acc), utils.clone(previous));

      if (isNotNullable(result) && 'next' in result) {
        return result.next;
      }

      return acc;
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
