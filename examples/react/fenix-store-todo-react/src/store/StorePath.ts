export const StorePath = Object.freeze({
  COMPLETED: 'progress.completed',
  DARK_MODE: 'darkMode',
  TASK: (id: string) => `tasks.items.${id}`,
  TASKS: 'tasks.items',
  TASK_IDS: 'tasks.ids',
  TOTAL: 'progress.total',
});
