const { configure } = require('@testing-library/react-native');

// React 19 compatibility
configure({ concurrentRoot: false });

// expo-camera
jest.mock('expo-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    CameraView: (props) => {
      const { onBarcodeScanned, barcodeScannerSettings, facing, ...rest } = props;
      return React.createElement(View, rest);
    },
    useCameraPermissions: jest.fn(() => [
      { granted: true, canAskAgain: true },
      jest.fn(),
    ]),
  };
});

// expo-system-ui
jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn(),
}));

// expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(() => Promise.resolve('')),
}));

// react-native-reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
}));

// @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn((cb) => cb()),
}));
