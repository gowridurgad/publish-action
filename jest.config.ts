import type {JestConfigWithTsJest} from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [151002]
        }
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!(@actions)/)'],
  verbose: true
};

export default jestConfig;
