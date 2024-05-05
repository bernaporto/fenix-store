export const isNotNullable = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;

export const isNullable = (value: unknown): value is null | undefined =>
  !isNotNullable(value);
