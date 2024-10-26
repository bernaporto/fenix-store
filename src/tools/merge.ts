import { isNullable } from './nullable';

export const merge = <T>(a: unknown, b: unknown): T => {
  if (typeof a !== typeof b) {
    return (b ?? a) as T;
  }

  if (typeof a !== 'object' || a === null) {
    return b as T;
  }

  if (typeof b !== 'object' || b === null) {
    return a as T;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b] as T;
  }

  return [...Object.keys(a), ...Object.keys(b)].reduce((acc, key) => {
    acc[key] = merge(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    );
    return acc;
  }, Object.create(null)) as T;
};

export const shallowMerge = <T>(...objects: (T | null | undefined)[]): T => {
  return objects.reduce((acc, obj) => {
    if (isNullable(obj)) {
      return acc;
    }

    if (Array.isArray(obj)) {
      return [...acc, ...obj] as T;
    }

    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        acc[key] = obj[key as keyof typeof obj];
      });
      return acc;
    }

    return acc;
  }, Object.create(null));
};
