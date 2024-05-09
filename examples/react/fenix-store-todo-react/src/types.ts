export type TTaskItem = {
  completed: boolean;
  id: string;
  label: string;
};

export type TTaskMap = Record<string, TTaskItem>;

export type TAppState = {
  tasks: {
    ids: string[];
    items: TTaskMap;
  };
  progress: {
    completed: number;
    total: number;
  };
};
