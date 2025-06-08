import { useEffect, useMemo, useState } from 'react';
import { store, type TStorePaths } from '../store';

export const useStore = <Path extends TStorePaths>(path: Path) => {
  const ob = useMemo(() => store.on(path), [path]);
  const [value, setValue] = useState(ob.get());

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
