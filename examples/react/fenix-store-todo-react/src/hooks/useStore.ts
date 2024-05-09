import { useEffect, useMemo, useState } from 'react';
import { store } from '../store';

export const useStore = <T>(path: string) => {
  const ob = useMemo(() => store.on<T>(path), [path]);
  const [data, setData] = useState<T>(ob.get());

  useEffect(
    () =>
      ob.subscribe((next) => {
        setData(next);
      }),
    [ob],
  );

  return {
    data,
    set: ob.set,
    update: ob.update,
  };
};
