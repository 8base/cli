module.exports = {
  globals: {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  setupFilesAfterEnv: ["./setup.ts"],
  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: [
    "/**/*.test.(ts|js)"
  ],
  clearMocks: true,
};
