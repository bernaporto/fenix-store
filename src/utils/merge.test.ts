import { merge } from './merge';

describe('merge', () => {
  it('should merge two objects', () => {
    const a = { a: 1 };
    const b = { b: 0 };
    const result = merge(a, b);

    expect(result).toEqual({ a: 1, b: 0 });
  });

  it('should deep merge two objects', () => {
    const a = { a: { a: 1 } };
    const b = { a: { b: 0 } };
    const result = merge(a, b);

    expect(result).toEqual({ a: { a: 1, b: 0 } });
  });

  it('should merge two arrays', () => {
    const a = [1];
    const b = [0];
    const result = merge(a, b);

    expect(result).toEqual([1, 0]);
  });

  it('should merge two arrays with objects', () => {
    const a = [{ a: 1 }];
    const b = [{ b: 0 }];
    const result = merge(a, b);

    expect(result).toEqual([{ a: 1 }, { b: 0 }]);
  });

  it('should gracefully handle null values', () => {
    const a = null;
    const b = { b: 0 };
    const result = merge(a, b);

    expect(result).toEqual({ b: 0 });

    const c = { a: 1 };
    const d = null;
    const result2 = merge(c, d);

    expect(result2).toEqual({ a: 1 });
  });
});
