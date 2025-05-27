import { describe, it, expect, vi } from 'vitest';
import { log, getDebugMessage } from './log';

describe('log utils', () => {
  describe('getDebugMessage', () => {
    it('should return only the action when a key is not provided', () => {
      expect(getDebugMessage('update')).toBe('update');
    });

    it('should handle falsy key values', () => {
      expect(getDebugMessage('update', '')).toBe('update');
      expect(getDebugMessage('update', undefined)).toBe('update');
    });

    it('should handle truthy key values', () => {
      expect(getDebugMessage('update', 'UserStore')).toBe('[UserStore] update');
    });
  });

  describe('log', () => {
    it('should call console methods', () => {
      const consoleSpy = vi
        .spyOn(console, 'groupCollapsed')
        .mockImplementation(() => {});
      const tableSpay = vi.spyOn(console, 'table').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const groupEndSpy = vi
        .spyOn(console, 'groupEnd')
        .mockImplementation(() => {});

      log({
        baseMsg: 'test',
        path: 'test.path',
        next: 'next',
        previous: 'prev',
        observers: 1,
      });

      expect(consoleSpy).toHaveBeenCalled();
      expect(tableSpay).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
      expect(groupEndSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      tableSpay.mockRestore();
      logSpy.mockRestore();
      groupEndSpy.mockRestore();
    });
  });

  describe('getCaller edge cases', () => {
    it('should handle Error with no stack property (triggers ?? fallback)', () => {
      // Mock Error without stack property
      const originalError = Error;
      global.Error = class extends originalError {
        constructor() {
          super();
          // Explicitly don't set stack property (or set to undefined)
          this.stack = undefined;
        }
      } as any;

      const consoleSpy = vi
        .spyOn(console, 'groupCollapsed')
        .mockImplementation(() => {});
      const tableSpay = vi.spyOn(console, 'table').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const groupEndSpy = vi
        .spyOn(console, 'groupEnd')
        .mockImplementation(() => {});

      log({
        baseMsg: 'test',
        path: 'test.path',
        next: 'next',
        previous: 'prev',
        observers: 1,
      });

      // Clean up
      consoleSpy.mockRestore();
      tableSpay.mockRestore();
      logSpy.mockRestore();
      groupEndSpy.mockRestore();
      global.Error = originalError;
    });

    it('should handle stack with all lines containing store', () => {
      // Mock Error.stack where ALL non-first lines contain 'store'
      const originalError = Error;
      global.Error = class extends originalError {
        constructor() {
          super();
          this.stack =
            'Error\n    at store.js:1:1\n    at store.helper:2:2\n    at store.module:3:3';
        }
      } as any;

      const consoleSpy = vi
        .spyOn(console, 'groupCollapsed')
        .mockImplementation(() => {});
      const tableSpay = vi.spyOn(console, 'table').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const groupEndSpy = vi
        .spyOn(console, 'groupEnd')
        .mockImplementation(() => {});

      log({
        baseMsg: 'test',
        path: 'test.path',
        next: 'next',
        previous: 'prev',
        observers: 1,
      });

      // Clean up
      consoleSpy.mockRestore();
      tableSpay.mockRestore();
      logSpy.mockRestore();
      groupEndSpy.mockRestore();
      global.Error = originalError;
    });
  });
});
