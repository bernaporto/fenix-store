import { classNames } from '../utils/classNames';

type TSwitchProps = {
  checked: boolean;
  onClick: VoidFunction;
};

export const Switch: React.FC<TSwitchProps> = ({ checked, onClick }) => {
  return (
    <button
      className={classNames(
        'flex items-center justify-center',
        'w-8 h-5',
        'rounded-full',
        'text-3xl',
        {
          'text-primary-500': checked,
          'text-gray-500': !checked,
        },
      )}
      onClick={onClick}
    >
      {checked ? (
        <i className="bi bi-toggle-on" />
      ) : (
        <i className="bi bi-toggle-off" />
      )}
    </button>
  );
};
