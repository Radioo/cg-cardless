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
        ThemeProvider: ({ children }: { children: React.ReactNode }) =>
            mockReact.createElement(mockReact.Fragment, null, children),
        useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() })),
        useLocalSearchParams: jest.fn(() => ({})),
        useFocusEffect: jest.fn((cb: () => void) => cb()),
    };
});

jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

jest.useFakeTimers();

describe('RootLayout', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    it('renders without crashing', async () => {
        const result = await render(<RootLayout />);
        expect(result).toBeTruthy();
    });

    it('can be unmounted without errors', async () => {
        const result = await render(<RootLayout />);
        await expect(result.unmount()).resolves.toBeUndefined();
    });

    it('returns null while fonts are loading', async () => {
        const { useFonts } = require('expo-font');
        (useFonts as jest.Mock).mockReturnValueOnce([false]);
        const { toJSON } = await render(<RootLayout />);
        expect(toJSON()).toBeNull();
    });

    it('wraps content in GlobalErrorBoundary', async () => {
        const GlobalErrorBoundary = require('@/components/global-error-boundary').GlobalErrorBoundary;
        const spy = jest.spyOn(GlobalErrorBoundary.prototype, 'render');
        await render(<RootLayout />);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('sets system background color on mount', async () => {
        const SystemUI = require('expo-system-ui');
        await render(<RootLayout />);
        expect(SystemUI.setBackgroundColorAsync).toHaveBeenCalled();
    });
});
