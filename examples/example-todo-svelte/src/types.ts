type TTaskItem = {
  completed: boolean;
  id: string;
  label: string;
};

export type TTaskMap = Record<string, TTaskItem>;

export type TAppState = {
  darkMode: boolean;
  progress: {
    completed: number;
    total: number;
  };
  tasks: {
    ids: string[];
    items: TTaskMap;
  };
};
