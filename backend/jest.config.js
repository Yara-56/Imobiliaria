/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  moduleFileExtensions: ["ts", "js", "json"],

  transform: {
    "^.+\\.ts$": "ts-jest"
  },

  testMatch: [
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts"
  ],

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts"
  ]
};