export const clone = <T>(value: T): T => {
  if (isClassInstance(value) || isFunction(value)) {
    return value;
  }

  return structuredClone(value);
};

const isClassInstance = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  value.constructor &&
  value.constructor !== Object;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';
