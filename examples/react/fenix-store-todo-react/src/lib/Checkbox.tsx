import { classNames } from '../utils/classNames';

type TCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Checkbox: React.FC<TCheckboxProps> = ({ checked, onChange }) => {
  return (
    <button
      className={classNames(
        'relative h-5 w-5',
        'flex items-center justify-center',
        'border rounded',
        'border-gray-400 dark:border-gray-600',
        'text-gray-100 dark:text-gray-900',
        {
          'border-0 bg-primary-400 dark:bg-primary-500': checked,
        },
      )}
      onClick={() => onChange(!checked)}
    >
      <span className="h-full w-full opacity-0 absolute cursor-pointer" />

      {checked && <i className="bi bi-check-lg" />}
    </button>
  );
};
