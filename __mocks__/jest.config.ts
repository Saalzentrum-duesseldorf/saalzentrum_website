module.exports = {
  // Andere Jest-Konfigurationen
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
