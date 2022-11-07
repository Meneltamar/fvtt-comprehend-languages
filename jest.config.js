const { pathsToModuleNameMapper } = require("ts-jest/");
const { compilerOptions } = require("./tsconfig");
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: [
    "<rootDir>",
    "<rootDir>/scripts/libs/",
    "<rootDir>/src/scripts/libs/",
  ],
  transform: {
    "^.+\\.(js)$": "babel-jest",
    "^.+\\.(ts)$": "ts-jest",
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  transformIgnorePatterns: [],
  moduleDirectories: ["node_modules"],
};
