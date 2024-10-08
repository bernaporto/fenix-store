import { useState } from 'react';
import { classNames } from '../utils/classNames';
import { StoreUtils } from '../store';

export const TaskInput: React.FC = () => {
  const [value, setValue] = useState('');

  const handleAddTask = () => {
    if (value) {
      StoreUtils.tasks.create(value);
      setValue('');
    }
  };

  return (
    <section className="w-full flex gap-3">
      <input
        className="bg-gray-200 dark:bg-gray-800 py-4 px-6 rounded-xl flex-1"
        placeholder="Enter your next task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        className={classNames(
          'w-13 h-13 p-2',
          'flex items-center justify-center',
          'text-gray-100 dark:text-gray-900 text-2xl',
          'bg-primary-400 dark:bg-primary-500',
          'rounded-xl',
        )}
        onClick={handleAddTask}
      >
        <i className="bi bi-plus-lg" />
      </button>
    </section>
  );
};
