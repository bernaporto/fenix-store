import { isNullable } from './nullable';

type TUnknownObject = Record<string, unknown>;

const PATH_SEPARATOR = '.';

export const parsePath = (path: string): string[] => path.split(PATH_SEPARATOR);
const getPathKeys = (path: string | string[]): string[] =>
  Array.isArray(path) ? path : parsePath(path);

export const getFromPath = (
  path: string | string[],
  obj: TUnknownObject,
): unknown | undefined => {
  if (path.length === 0 || isNullable(obj)) {
    return undefined;
  }

  const keys = getPathKeys(path);

  return keys.reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') {
      return undefined;
    }

    return (acc as TUnknownObject)[key] ?? undefined;
  }, obj);
};

export const setAtPath = (
  path: string | string[],
  value: unknown,
  obj: TUnknownObject,
): void => {
  if (isNullable(obj) || path.length === 0) {
    return;
  }

  const keys = getPathKeys(path);

  keys.reduce((acc, key, index) => {
    if (index < keys.length - 1) {
      const curr = acc[key];

      if (isNullable(curr) || typeof curr !== 'object') {
        acc[key] = Object.create(null);
      }

      return acc[key] as TUnknownObject;
    }

    acc[key] = value;

    return acc;
  }, obj);
};

export const deleteAtPath = (
  path: string | string[],
  obj: TUnknownObject,
): boolean => {
  if (isNullable(obj) || path.length === 0) {
    return false;
  }

  const keys = getPathKeys(path);

  const targetKey = keys.pop();
  let targetObj = obj;

  for (const key of keys) {
    const curr = targetObj[key];

    if (isNullable(curr) || typeof curr !== 'object') {
      // The key does not exist or the value is not an object
      return false;
    }

    targetObj = curr as TUnknownObject;
  }

  if (targetKey && targetObj && targetKey in targetObj) {
    delete targetObj[targetKey];

    return true;
  }

  return false;
};
