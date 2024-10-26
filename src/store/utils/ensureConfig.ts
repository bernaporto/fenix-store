import { clone, equals, merge } from '@/tools';
import type { TOptionalStoreConfig, TStoreConfig } from '../types';

const defaultConfig: TStoreConfig = {
  utils: { clone, equals },
  debug: false,
};

export const ensureConfig = (config?: TOptionalStoreConfig): TStoreConfig =>
  merge<TStoreConfig>(defaultConfig, config);
