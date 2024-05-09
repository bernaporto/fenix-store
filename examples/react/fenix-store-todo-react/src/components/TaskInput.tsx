import { useState } from 'react';
import { useTaskList } from '../hooks/useTaskList';
import { classNames } from '../utils/classNames';

export const TaskInput: React.FC = () => {
  const [label, setLabel] = useState('');
  const tasks = useTaskList();

  const handleAddTask = () => {
    if (label) {
      tasks.add(label);
      setLabel('');
    }
  };

  return (
    <section className="w-full flex gap-3">
      <input
        className="bg-gray-200 dark:bg-gray-800 py-4 px-6 rounded-xl flex-1"
        placeholder="Enter your next task..."
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <button
        className={classNames(
          'w-13 h-13 p-2',
          'flex items-center justify-center',
          'bg-primary-400 dark:bg-primary-600',
          'rounded-xl',
        )}
        onClick={handleAddTask}
      >
        <img
          className="w-6 h-6"
          src="./icons/plus-lg.svg"
          alt="Add task icon"
        />
      </button>
    </section>
  );
};
