import { isNotNullable, isNullable } from './nullable';

describe('isNullable', () => {
  it('should return true for null', () => {
    expect(isNullable(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNullable(undefined)).toBe(true);
  });

  it('should return false for a value', () => {
    expect(isNullable(0)).toBe(false);
    expect(isNullable('')).toBe(false);
    expect(isNullable({})).toBe(false);
    expect(isNullable([])).toBe(false);
  });
});

describe('isNotNullable', () => {
  it('should return false for null', () => {
    expect(isNotNullable(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNotNullable(undefined)).toBe(false);
  });

  it('should return true for a value', () => {
    expect(isNotNullable(0)).toBe(true);
    expect(isNotNullable('')).toBe(true);
    expect(isNotNullable({})).toBe(true);
    expect(isNotNullable([])).toBe(true);
  });
});
