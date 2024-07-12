import { isNullable } from './nullable';

type TUnknownObject = Record<string, unknown>;

const PATH_SEPARATOR = '.';

export const getFromPath = (
  path: string,
  obj: TUnknownObject,
): unknown | undefined => {
  const keys = path.split(PATH_SEPARATOR);

  return keys.reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') {
      return undefined;
    }

    return (acc as TUnknownObject)[key] ?? undefined;
  }, obj);
};

export const setAtPath = (
  path: string,
  value: unknown,
  obj: TUnknownObject,
): void => {
  if (isNullable(obj)) {
    return;
  }

  const keys = path.split(PATH_SEPARATOR);

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
