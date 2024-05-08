import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  return (
    <section className="flex-1 flex flex-col gap-4 overflow-y-auto">
      {['task 1', 'task 2', 'task 3'].map((task, index) => (
        <TaskItem key={index} label={task} />
      ))}
    </section>
  );
};
