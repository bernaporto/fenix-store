export const log = ({
  baseMsg,
  path,
  next,
  previous,
  observers,
}: {
  baseMsg: string;
  path: string;
  next: unknown;
  previous: unknown;
  observers: number;
}) => {
  console.groupCollapsed(
    `${baseMsg}( %c${path}`,
    'font-weight: 400; color: #cccc00;',
    ')',
  );
  console.table({
    previous: {
      value: previous,
    },
    next: {
      value: next,
    },
    observers: {
      count: observers,
    },
  });
  console.log(`%ccalled ${getCaller()}`, `color: #909090;`);
  console.groupEnd();
};

const getCaller = () => {
  const stack = (new Error().stack ?? '').split('\n');
  const caller =
    stack.find((line, index) => {
      if (index === 0) return false;
      return !line.includes('store');
    }) ?? '';

  return caller.trim();
};

export const getDebugMessage = (action: string, key?: string) => {
  return [key && `[${key}]`, action].filter(Boolean).join(' ');
};
