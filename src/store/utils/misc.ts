import { parsePath } from '@bernaporto/utilities';
import { TObservableProxy } from '../ObservableProxy/types';

type ProxyEntry = [string, TObservableProxy<unknown>];

export const sortByPathLength = ([a]: ProxyEntry, [b]: ProxyEntry) =>
  parsePath(b).length - parsePath(a).length;

export const isRelatedTo =
  (path: string) =>
  ([p]: ProxyEntry) =>
    p !== path && (path.startsWith(p) || p.startsWith(path));
