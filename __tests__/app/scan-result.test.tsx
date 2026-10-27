import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScanResultScreen from '@/app/scan-result';
import { createWrapper } from '../helpers';

const TEST_URL = 'https://example.com/sppass/' + 'a'.repeat(64);
const TEST_CARD_ID = 'ABC123';
const mockDismissTo = jest.fn();

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
        dismissTo: mockDismissTo,
    });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ url: TEST_URL });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(TEST_CARD_ID);
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        }),
    ) as jest.Mock;
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

describe('ScanResultScreen', () => {
    it('shows success message after successful request', async () => {
        const { findByText } = await render(<ScanResultScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText('Success')).toBeTruthy();
    });

    it('returns to the home screen when Scan again is pressed after success', async () => {
        const { findByTestId } = await render(<ScanResultScreen />, {
            wrapper: createWrapper(),
        });

        await fireEvent.press(await findByTestId('scan-again-btn'));

        expect(mockDismissTo).toHaveBeenCalledWith('/');
    });

    it('does not show Scan again on failed request', async () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            }),
        );

        const { findByText, queryByTestId } = await render(<ScanResultScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText('Retry')).toBeTruthy();
        expect(queryByTestId('scan-again-btn')).toBeNull();
    });

    it('shows error message on failed request', async () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({}),
            }),
        );

        const { findAllByText } = await render(<ScanResultScreen />, {
            wrapper: createWrapper(),
        });

        const matches = await findAllByText(/Server returned 500/);
        expect(matches.length).toBeGreaterThan(0);
    });

    it('shows invalid URL screen for non-matching URLs', async () => {
        (useLocalSearchParams as jest.Mock).mockReturnValue({ url: 'https://bad-url.com' });

        const { findByText } = await render(<ScanResultScreen />, {
            wrapper: createWrapper(),
        });

        expect(await findByText('Invalid QR Code')).toBeTruthy();
        expect(global.fetch).not.toHaveBeenCalled();
    });
});
