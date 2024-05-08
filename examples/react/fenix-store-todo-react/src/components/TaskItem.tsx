import { Card } from '../lib/Card';

type TTaskItemProps = {
  label: string;
};

export const TaskItem: React.FC<TTaskItemProps> = ({ label }) => {
  return (
    <Card className="w-full px-6 py-4">
      <article className="capitalize">{label}</article>
    </Card>
  );
};
