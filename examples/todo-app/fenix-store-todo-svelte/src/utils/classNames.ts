type StringMap = Record<string, boolean>;
type PossibleInput = null | string | StringMap | undefined;

const isValid = <T>(value: T | null | undefined): value is T =>
  !!value && value !== null && value !== undefined;

const parseInputs = (inputs: PossibleInput[]): string[] =>
  inputs.filter(isValid).flatMap((c) => {
    if (typeof c !== 'object') return c;

    return Object.entries(c)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k);
  });

export const classNames = (...classes: PossibleInput[]): string =>
  parseInputs(classes).join(' ');
