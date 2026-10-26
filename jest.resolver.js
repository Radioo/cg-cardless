// Chains Reanimated's resolver (loads its web implementation in Jest) in front of the
// React Native resolver that the jest-expo preset would otherwise use on its own.
const reactNativeResolver = require('@react-native/jest-preset/jest/resolver');
const reanimatedResolver = require('react-native-reanimated/jest/resolver');

/** @type {import('jest-resolve').SyncResolver} */
module.exports = (request, options) =>
    reanimatedResolver(request, {
        ...options,
        defaultResolver: (path, nextOptions) =>
            reactNativeResolver(path, { ...nextOptions, defaultResolver: options.defaultResolver }),
    });
