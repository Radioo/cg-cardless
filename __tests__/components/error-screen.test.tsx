import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';
import { ErrorScreen } from '@/components/error-screen';
import { type ErrorReport } from '@/utils/error-report';

const mockReport: ErrorReport = {
    errorName: 'TypeError',
    errorMessage: 'Cannot read property of undefined',
    stackTrace: 'at foo (bar.ts:1)\nat baz (qux.ts:2)',
    componentStack: '<App>\n  <Screen>',
    source: 'ErrorBoundary',
    timestamp: '2026-01-01T00:00:00.000Z',
    platform: 'android',
    appVersion: '1.0.0',
    deviceName: 'Pixel 7',
    osVersion: 'android 14',
};

describe('ErrorScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders error name and message', async () => {
        const { getByText } = await render(
            <ErrorScreen report={mockReport} onReset={jest.fn()} />,
        );
        expect(getByText('TypeError')).toBeTruthy();
        expect(getByText('Cannot read property of undefined')).toBeTruthy();
    });

    it('renders source badge', async () => {
        const { getByText } = await render(
            <ErrorScreen report={mockReport} onReset={jest.fn()} />,
        );
        expect(getByText('ErrorBoundary')).toBeTruthy();
    });

    it('calls onReset when Try Again is pressed', async () => {
        const onReset = jest.fn();
        const { getByText } = await render(
            <ErrorScreen report={mockReport} onReset={onReset} />,
        );
        await fireEvent.press(getByText('Try Again'));
        expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('copies error report to clipboard', async () => {
        const { getByText } = await render(
            <ErrorScreen report={mockReport} onReset={jest.fn()} />,
        );
        await act(async () => {
            await fireEvent.press(getByText('Copy Error Report'));
        });
        expect(Clipboard.setStringAsync).toHaveBeenCalled();
    });

    it('toggles stack trace section', async () => {
        const { getByTestId, getByText } = await render(
            <ErrorScreen report={mockReport} onReset={jest.fn()} />,
        );
        // Stack trace is open by default
        expect(getByText(mockReport.stackTrace)).toBeTruthy();
        // Toggle closed
        await fireEvent.press(getByTestId('toggle-Stack Trace'));
    });

    it('renders environment info when opened', async () => {
        const { getByTestId, getByText } = await render(
            <ErrorScreen report={mockReport} onReset={jest.fn()} />,
        );
        await fireEvent.press(getByTestId('toggle-Environment'));
        expect(getByText('Pixel 7')).toBeTruthy();
        expect(getByText('1.0.0')).toBeTruthy();
    });
});
