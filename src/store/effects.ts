import { TExtendedEffectManager, TStoreEffect } from './types';

export const getEffectManager = (): TExtendedEffectManager => {
  const effects = new Set<TStoreEffect>();

  return {
    clear: () => {
      effects.clear();
    },

    list: () => Array.from(effects),

    use: (effect) => {
      effects.add(effect);
    },
  };
};
