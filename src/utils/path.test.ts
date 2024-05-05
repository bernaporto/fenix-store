import { deletePath, getFromPath, setAtPath } from './path';

describe('deletePath', () => {
  it('should delete the value from an object at a path', () => {
    const obj = { a: { b: { c: 1 } } };
    const path = 'a.b.c';

    deletePath(path, obj);

    expect(obj.a.b.c).toBeUndefined();
  });

  it('should gracefully handle null values', () => {
    const obj = null;
    const path = 'a.b.c';

    deletePath(path, obj as any);

    expect(obj).toBeNull();
  });

  it('should gracefully handle null values in the path', () => {
    const obj = { a: null } as any;
    const path = 'a.b.c';

    deletePath(path, obj);

    expect(obj.a?.b).toBeUndefined();
  });
});

describe('getFromPath', () => {
  it('should retrieve the value from an object at a path', () => {
    const obj = { a: { b: { c: 1 } } };
    const path = 'a.b.c';
    const value = getFromPath(path, obj);

    expect(value).toBe(1);
  });

  it('should gracefully return undefined if the path does not exist', () => {
    const obj = { a: { b: { c: 1 } } };
    const path = 'a.b.d';
    const value = getFromPath(path, obj);

    expect(value).toBeUndefined();
  });

  it('should gracefully return undefined if the path is invalid', () => {
    const obj = { a: { b: { c: 1 } } };
    const path = 'a.b.c.d';
    const value = getFromPath(path, obj);

    expect(value).toBeUndefined();
  });

  it('should gracefully return undefined if the object is null', () => {
    const obj = null;
    const path = 'a.b.c';
    const value = getFromPath(path, obj as any);

    expect(value).toBeUndefined();
  });
});

describe('setAtPath', () => {
  it('should set the value of an object at a path', () => {
    const obj = { a: { b: { c: 1 } } };
    const path = 'a.b.c';
    const value = 2;

    setAtPath(path, value, obj);

    expect(obj.a.b.c).toBe(value);
  });

  it('should create the path if it does not exist', () => {
    const obj = { a: { b: { c: 1 } } } as any;
    const path = 'a.b.d';
    const value = 2;

    setAtPath(path, value, obj);

    expect(obj.a.b.d).toBe(value);
  });

  it('should gracefully handle null values', () => {
    const obj = null;
    const path = 'a.b.c';
    const value = 2;

    setAtPath(path, value, obj as any);

    expect(obj).toEqual(null);
  });

  it('should gracefully handle null values in the path', () => {
    const obj = { a: null } as any;
    const path = 'a.b.c';
    const value = 2;

    setAtPath(path, value, obj);

    expect(obj.a.b.c).toBe(value);
  });
});
