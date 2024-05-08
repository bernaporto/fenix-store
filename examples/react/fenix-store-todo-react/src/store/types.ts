import { TTaskItem } from '../types';

export type TAppState = {
  tasks: {
    ids: string[];
    items: Record<string, TTaskItem>;
  };
};
