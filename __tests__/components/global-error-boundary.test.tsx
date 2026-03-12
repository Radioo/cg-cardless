import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';

import { GlobalErrorBoundary } from '@/components/global-error-boundary';

jest.useFakeTimers();

// Suppress expected console.error from React error boundaries
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        // Suppress Error objects logged by React's defaultOnCaughtError
        if (args[0] instanceof Error) {
            return;
        }
        const msg = args.map(String).join(' ');
        // Suppress React error boundary messages
        if (
            msg.includes('The above error') ||
            msg.includes('Error: Uncaught')
        ) {
            return;
        }
        originalConsoleError(...args);
    };
});
afterAll(() => {
    console.error = originalConsoleError;
});

function ThrowingComponent({shouldThrow}: {shouldThrow: boolean}) {
    if (shouldThrow) {
        throw new Error('Test render error');
    }
    return <Text>App Content</Text>;
}

describe('GlobalErrorBoundary', () => {
    it('renders children when there is no error', () => {
        const {getByText} = render(
            <GlobalErrorBoundary>
                <Text>Hello World</Text>
            </GlobalErrorBoundary>,
        );
        expect(getByText('Hello World')).toBeTruthy();
    });

    it('catches render errors and shows error screen', () => {
        const {getByText} = render(
            <GlobalErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </GlobalErrorBoundary>,
        );
        expect(getByText('Error')).toBeTruthy();
        expect(getByText('Test render error')).toBeTruthy();
        expect(getByText('React Component Error')).toBeTruthy();
    });

    it('shows stack trace section by default', () => {
        const {getByTestId, getByText} = render(
            <GlobalErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </GlobalErrorBoundary>,
        );
        // Stack Trace section header should be visible
        expect(getByTestId('toggle-Stack Trace')).toBeTruthy();
        // The section should be open by default — look for some stack content
        expect(getByText('Test render error')).toBeTruthy();
    });

    it('toggles collapsible sections', () => {
        const {getByTestId, queryByText} = render(
            <GlobalErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </GlobalErrorBoundary>,
        );

        // Environment section is closed by default
        const envToggle = getByTestId('toggle-Environment');
        expect(queryByText('Test Device')).toBeNull();

        // Open it
        fireEvent.press(envToggle);
        expect(queryByText('Test Device')).toBeTruthy();

        // Close it
        fireEvent.press(envToggle);
        expect(queryByText('Test Device')).toBeNull();
    });

    it('copies error report to clipboard', async () => {
        const {getByText} = render(
            <GlobalErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </GlobalErrorBoundary>,
        );

        await act(async () => {
            fireEvent.press(getByText('Copy Error Report'));
        });

        expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
            expect.stringContaining('Test render error'),
        );
        expect(getByText('Copied!')).toBeTruthy();
    });

    it('resets error boundary when Try Again is pressed', () => {
        let shouldThrow = true;
        function ConditionalThrower() {
            if (shouldThrow) {
                throw new Error('Temporary error');
            }
            return <Text>Recovered</Text>;
        }

        const {getByText} = render(
            <GlobalErrorBoundary>
                <ConditionalThrower />
            </GlobalErrorBoundary>,
        );

        expect(getByText('Temporary error')).toBeTruthy();

        // Fix the error and reset
        shouldThrow = false;
        fireEvent.press(getByText('Try Again'));
        expect(getByText('Recovered')).toBeTruthy();
    });
});
