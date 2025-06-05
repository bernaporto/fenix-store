import type { TCacheItem } from '../types';

type TEntry = [string, TCacheItem];

export const sortByPathLength = ([, a]: TEntry, [, b]: TEntry) =>
  b.parsedPath.length - a.parsedPath.length;

export const isRelatedTo =
  (path: string) =>
  ([p]: TEntry) =>
    p !== path && (path.startsWith(p) || p.startsWith(path));
