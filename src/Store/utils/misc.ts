import { parsePath } from '@/tools';
import { TObservableController } from '../ObservableController/types';

type TEntry = [string, TObservableController<unknown>];

export const sortByPathLength = ([a]: TEntry, [b]: TEntry) =>
  parsePath(b).length - parsePath(a).length;

export const isRelatedTo =
  (path: string) =>
  ([p]: TEntry) =>
    p !== path && (path.startsWith(p) || p.startsWith(path));
