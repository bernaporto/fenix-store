import { create } from './create';

export type Store = ReturnType<typeof create>;
const Store = {
  create,
};

export { Store };
