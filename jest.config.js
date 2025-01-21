module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx"],
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
  };