import { describe, expect, it } from 'vitest';
import { clone } from './clone';

describe('clone', () => {
  it('should clone a value', () => {
    const obj = { a: 1, b: '2' };
    const cloned = clone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it('should not clone class instances', () => {
    class TestClass {
      constructor(public value: number) {}
    }

    const instance = new TestClass(42);
    const clonedInstance = clone(instance);

    expect(clonedInstance).toBe(instance);
  });

  it('should not clone functions', () => {
    const func = () => 'test';
    const clonedFunc = clone(func);

    expect(clonedFunc).toBe(func);
  });
});
