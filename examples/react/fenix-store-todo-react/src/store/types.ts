export type TAppState = {
  todos: {
    ids: string[];
    items: Record<string, TTodoItem>;
  };
};

export type TTodoItem = {
  id: string;
  label: string;
};
