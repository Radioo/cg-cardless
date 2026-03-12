const { configure } = require('@testing-library/react-native');
const { notifyManager } = require('@tanstack/react-query');

// React 19 compatibility
configure({ concurrentRoot: false });

// Make react-query use microtasks instead of setTimeout so act() can flush updates
notifyManager.setScheduler(queueMicrotask);

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
    useIsFocused: jest.fn(() => true),
}));

// exit-app
jest.mock('@/modules/exit-app', () => ({
    ExitApp: {
        exitApp: jest.fn(),
    },
}));

// react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        SafeAreaView: (props) => React.createElement(View, props),
        SafeAreaProvider: (props) => React.createElement(View, props),
        useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
    };
});

// expo-constants
jest.mock('expo-constants', () => ({
    __esModule: true,
    default: {
        expoConfig: { version: '1.0.0' },
        deviceName: 'Test Device',
    },
}));

// expo-font
jest.mock('expo-font', () => ({
    useFonts: jest.fn(() => [true]),
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
}));

// @expo/vector-icons
jest.mock('@expo/vector-icons/Ionicons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return (props) => React.createElement(Text, props, props.name);
});
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    const Ionicons = (props) => React.createElement(Text, props, props.name);
    Ionicons.font = { ionicons: 'ionicons' };
    return { Ionicons };
});

// felica-emulator
jest.mock('@/modules/felica-emulator', () => ({
    FelicaEmulator: {
        isHceFSupported: jest.fn(() => false),
        isNfcEnabled: jest.fn(() => false),
        getStatus: jest.fn(() => ({
            isEmulationActive: false,
            currentIdm: null,
            currentSystemCode: null,
        })),
        setIdm: jest.fn(() => Promise.resolve(true)),
        setSystemCode: jest.fn(() => Promise.resolve(true)),
        enableEmulation: jest.fn(() => Promise.resolve(true)),
        disableEmulation: jest.fn(() => Promise.resolve()),
    },
}));

// react-native-css-interop — stub the interop used by NativeWind babel transform
jest.mock('react-native-css-interop', () => ({
    cssInterop: jest.fn(),
    remapProps: jest.fn(),
    StyleSheet: {
        create: (styles) => styles,
    },
}));

// NativeWind / className support — strip className props in tests
jest.mock('nativewind', () => ({
    useColorScheme: jest.fn(() => ({
        colorScheme: 'light',
        setColorScheme: jest.fn(),
        toggleColorScheme: jest.fn(),
    })),
}));

// @/hooks/use-color-scheme (NativeWind wrapper)
jest.mock('@/hooks/use-color-scheme', () => ({
    useColorScheme: jest.fn(() => ({
        colorScheme: 'light',
        isDarkColorScheme: false,
        setColorScheme: jest.fn(),
        toggleColorScheme: jest.fn(),
    })),
}));

// @/constants/theme
jest.mock('@/constants/theme', () => ({
    NAV_THEME: {
        light: {
            background: '#ffffff',
            border: '#cccccc',
            card: '#ffffff',
            notification: '#ff0000',
            primary: '#007aff',
            text: '#000000',
        },
        dark: {
            background: '#000000',
            border: '#333333',
            card: '#000000',
            notification: '#ff0000',
            primary: '#0a84ff',
            text: '#ffffff',
        },
    },
}));

// @/utils/cn (cn utility)
jest.mock('@/utils/cn', () => ({
    cn: (...args) => args.filter(Boolean).join(' '),
}));

// class-variance-authority
jest.mock('class-variance-authority', () => ({
    cva: () => () => '',
}));

// @rn-primitives/slot
jest.mock('@rn-primitives/slot', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return {
        View: (props) => React.createElement(View, props),
        Text: (props) => React.createElement(Text, props),
    };
});

// @rn-primitives/separator
jest.mock('@rn-primitives/separator', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        Root: (props) => React.createElement(View, props),
    };
});

// @rn-primitives/alert-dialog
jest.mock('@rn-primitives/alert-dialog', () => {
    const React = require('react');
    const { View, Text, Pressable } = require('react-native');
    return {
        Root: ({ children, open }) => open ? React.createElement(View, null, children) : null,
        Trigger: (props) => React.createElement(Pressable, props),
        Portal: ({ children }) => React.createElement(React.Fragment, null, children),
        Overlay: (props) => React.createElement(View, props),
        Content: (props) => React.createElement(View, props),
        Title: (props) => React.createElement(Text, props),
        Description: (props) => React.createElement(Text, props),
        Action: (props) => React.createElement(Pressable, props),
        Cancel: (props) => React.createElement(Pressable, props),
    };
});

// @rn-primitives/portal
jest.mock('@rn-primitives/portal', () => {
    return {
        PortalHost: () => null,
    };
});

// react-native-screens
jest.mock('react-native-screens', () => {
    const React = require('react');
    return {
        FullWindowOverlay: (props) => React.createElement(React.Fragment, null, props.children),
    };
});

// @/global.css — no-op
jest.mock('@/global.css', () => ({}));
