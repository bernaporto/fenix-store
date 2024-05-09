import { Card } from '../lib/Card';
import { Checkbox } from '../lib/Checkbox';
import { classNames } from '../utils/classNames';
import type { TTaskItem } from '../types';
import { useDeleteTask, useTaskProperty } from '../hooks';

type TTaskItemProps = Pick<TTaskItem, 'id'>;

export const TaskItem: React.FC<TTaskItemProps> = (props) => (
  <Card className="w-full h-13 px-4 py-3 flex gap-4 items-center">
    <CustomCheckbox {...props} />
    <Label {...props} />
    <DeleteButton {...props} />
  </Card>
);

const CustomCheckbox: React.FC<TTaskItemProps> = ({ id }) => {
  const { set, value } = useTaskProperty(id, 'completed');

  return <Checkbox checked={value} onChange={set} />;
};

const Label: React.FC<TTaskItemProps> = ({ id }) => {
  const { value: label } = useTaskProperty(id, 'label');
  const { value: completed } = useTaskProperty(id, 'completed');

  return (
    <article
      className={classNames('capitalize truncate flex-1', {
        'line-through opacity-50': completed,
      })}
      title={label}
    >
      {label}
    </article>
  );
};

const DeleteButton: React.FC<TTaskItemProps> = ({ id }) => {
  const deleteTask = useDeleteTask(id);

  return (
    <button
      className="w-7 h-7 text-lg opacity-80 hover:opacity-100 rounded"
      onClick={deleteTask}
    >
      <i className="bi bi-trash3" />
    </button>
  );
};
