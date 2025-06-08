type IsValidObject<T> = T extends object
  ? keyof T extends never
    ? false
    : true
  : false;

type IsArray<T> = T extends unknown[] ? true : false;

type DefaultPaths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? `${K}` | `${K}.${Paths<T[K]>}`
        : never;
    }[keyof T]
  : never;

type ArrayPaths<T> = T extends readonly (infer U)[]
  ? U extends object
    ? `${number}` | `${number}.${Paths<U>}`
    : `${number}`
  : never;

type RecordPaths<T, Deep extends boolean = true> = T extends object
  ? string extends keyof T
    ? Deep extends true
      ? `${string}`
      : `${string}.${Paths<T[string]>}`
    : DefaultPaths<T>
  : never;

// Separate deep and shallow calculations to avoid TypeScript collapsing `${string}` unions
// This preserves both direct paths (e.g., `items.${string}`) and nested paths (e.g., `items.${string}.id`)
type GetDeepPaths<T> =
  IsValidObject<T> extends true
    ? IsArray<T> extends true
      ? ArrayPaths<T>
      : RecordPaths<T, true>
    : never;

type GetShallowPaths<T> =
  IsValidObject<T> extends true
    ? IsArray<T> extends true
      ? ArrayPaths<T>
      : RecordPaths<T, false>
    : never;

export type Paths<T> = GetDeepPaths<T> | GetShallowPaths<T>;

export type Get<Obj, Key extends string> = Obj extends object
  ? Key extends `${infer Parent}.${infer Leaf}`
    ? Parent extends keyof Obj
      ? Get<Obj[Parent], Leaf>
      : never
    : Key extends keyof Obj
      ? Obj[Key]
      : never
  : never;
