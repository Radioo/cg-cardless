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
    return {
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

    it('can be unmounted without errors', () => {
        const result = render(<RootLayout />);
        expect(() => result.unmount()).not.toThrow();
    });

    it('returns null while fonts are loading', () => {
        const { useFonts } = require('expo-font');
        (useFonts as jest.Mock).mockReturnValueOnce([false]);
        const { toJSON } = render(<RootLayout />);
        expect(toJSON()).toBeNull();
    });

    it('wraps content in GlobalErrorBoundary', () => {
        const GlobalErrorBoundary = require('@/components/global-error-boundary').GlobalErrorBoundary;
        const spy = jest.spyOn(GlobalErrorBoundary.prototype, 'render');
        render(<RootLayout />);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('sets system background color on mount', () => {
        const SystemUI = require('expo-system-ui');
        render(<RootLayout />);
        expect(SystemUI.setBackgroundColorAsync).toHaveBeenCalled();
    });
});
