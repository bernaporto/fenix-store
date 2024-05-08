import { useEffect, useMemo, useState } from 'react';
import { store } from '../store';

export const useStore = <T>(path: string) => {
  const ob = useMemo(() => store.on<T>(path), [path]);

  const [data, setData] = useState<T>(ob.get());

  useEffect(() => {
    return ob.subscribe(setData);
  }, [ob]);

  return {
    data,
    set: ob.set,
    update: ob.update,
  };
};
