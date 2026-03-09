/** @type {import('jest').Config} */
module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '__tests__/helpers\\.tsx$', '/e2e/', '/e2e-ios/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
};
