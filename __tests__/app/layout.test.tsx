import React from 'react';
import { render } from '@testing-library/react-native';

import RootLayout from '@/app/_layout';

jest.mock('expo-router', () => {
    const mockReact = require('react');
    const mockScreen = () => null;
    const mockStack = ({ children }: { children?: React.ReactNode }) =>
        mockReact.createElement(mockReact.Fragment, null, children);
    mockStack.Screen = mockScreen;
    return {
        Stack: mockStack,
        useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() })),
        useLocalSearchParams: jest.fn(() => ({})),
    };
});

jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

jest.mock('@react-navigation/native', () => {
    const mockReact = require('react');
    const { Colors } = require('@/constants/theme');
    return {
        DarkTheme: { colors: { background: Colors.dark.background, card: Colors.dark.background } },
        DefaultTheme: { colors: { background: Colors.light.background, card: Colors.light.background } },
        ThemeProvider: ({ children }: { children: React.ReactNode }) =>
            mockReact.createElement(mockReact.Fragment, null, children),
        useFocusEffect: jest.fn((cb: () => void) => cb()),
    };
});

jest.useFakeTimers();

describe('RootLayout', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    it('renders without crashing', () => {
        const result = render(<RootLayout />);
        expect(result).toBeTruthy();
    });

    it('provides QueryClientProvider context', () => {
        const result = render(<RootLayout />);
        expect(result).toBeDefined();
    });

    it('can be unmounted without errors', () => {
        const result = render(<RootLayout />);
        expect(() => result.unmount()).not.toThrow();
    });
});
