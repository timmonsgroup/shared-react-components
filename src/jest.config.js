module.exports = {
  testPathIgnorePatterns: ['node_modules', 'dist'], // might want?
  moduleNameMapper: {
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.js', '@testing-library/jest-dom/extend-expect'] // this is the KEY
  // note it should be in the top level of the exported object.
};