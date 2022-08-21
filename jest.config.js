module.exports = {
  modulePaths: ["<rootDir>", "<rootDir>/scripts/libs/"],
  transform: {
    "^.+\\.(js)$": "babel-jest",
  },
  transformIgnorePatterns: [],
  moduleDirectories: ["node_modules"],
};
