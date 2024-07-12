import { describe, expect, it } from 'vitest';
import { clone } from './clone';

describe('clone', () => {
  it('should clone a value', () => {
    const obj = { a: 1, b: '2' };
    const cloned = clone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });
});
