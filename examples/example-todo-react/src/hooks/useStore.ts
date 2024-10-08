import { useEffect, useMemo, useState } from 'react';
import { store } from '../store';

export const useStore = <T>(path: string) => {
  const ob = useMemo(() => store.on<T>(path), [path]);
  const [value, setValue] = useState<T>(ob.get());

  useEffect(
    () =>
      ob.subscribe((next) => {
        setValue(next);
      }),
    [ob],
  );

  return {
    value,
    set: ob.set,
    update: ob.update,
    reset: ob.reset,
  };
};
