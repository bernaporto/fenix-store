import { describe, expect, it } from 'vitest';
import { equals } from './equals';

describe('equals', () => {
  it('should shallow compare values', () => {
    const a = 1;
    const b = 1;

    expect(equals(a, b)).toBe(true);
  });
});
