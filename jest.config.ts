export default {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
};
