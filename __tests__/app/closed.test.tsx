import React from 'react';
import { Platform } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import ClosedScreen from '@/app/closed';

const mockClose = jest.fn();
Object.defineProperty(window, 'close', { value: mockClose, writable: true });
const mockDismissTo = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
        dismissTo: mockDismissTo,
    });
});

describe('ClosedScreen', () => {
    it('renders done message', async () => {
        const { getByText } = await render(<ClosedScreen />);
        expect(getByText('Done')).toBeTruthy();
        expect(getByText('You can close this page now.')).toBeTruthy();
    });

    it('returns to the home screen when Scan again is pressed', async () => {
        const { getByTestId } = await render(<ClosedScreen />);

        await fireEvent.press(getByTestId('scan-again-btn'));

        expect(mockDismissTo).toHaveBeenCalledWith('/');
    });

    it('calls window.close on web', async () => {
        const originalOS = Platform.OS;
        Platform.OS = 'web';
        try {
            await render(<ClosedScreen />);
            expect(mockClose).toHaveBeenCalled();
        } finally {
            Platform.OS = originalOS;
        }
    });

    it('does not call window.close on native', async () => {
        await render(<ClosedScreen />);
        expect(mockClose).not.toHaveBeenCalled();
    });
});
