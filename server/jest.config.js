/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  clearMocks: true,
  restoreMocks: true,
  watchman: false,
  collectCoverageFrom: [
    "controllers/**/*.ts",
    "graphql/resolvers/**/*.ts",
    "middlewares/**/*.ts",
    "utils/**/*.ts",
    "!**/*.d.ts",
  ],
  coverageDirectory: "coverage",
};
