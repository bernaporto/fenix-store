import { FenixStore } from '@bernaporto/fenix-store';
import { TAppState, TTodoItem } from './types';
import { StorePath } from '.';

// Create the store with initial value to make sure that these paths will never return undefined
export const store = FenixStore.create<TAppState>({
  todos: {
    ids: [],
    items: {},
  },
});

// Add a middleware to set the id list once items change
store.effects.use<Record<string, TTodoItem>>((path, next) => {
  if (path === StorePath.TODOS) {
    store.on(StorePath.TODO_IDS).set(Object.keys(next));
  }
});
