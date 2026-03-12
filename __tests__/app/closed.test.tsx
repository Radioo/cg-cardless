import React from 'react';
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import ClosedScreen from '@/app/closed';

const mockClose = jest.fn();
Object.defineProperty(window, 'close', { value: mockClose, writable: true });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ClosedScreen', () => {
    it('renders done message', () => {
        const { getByText } = render(<ClosedScreen />);
        expect(getByText('Done')).toBeTruthy();
        expect(getByText('You can close this page now.')).toBeTruthy();
    });

    it('calls window.close on web', () => {
        const originalOS = Platform.OS;
        Platform.OS = 'web';
        try {
            render(<ClosedScreen />);
            expect(mockClose).toHaveBeenCalled();
        } finally {
            Platform.OS = originalOS;
        }
    });

    it('does not call window.close on native', () => {
        render(<ClosedScreen />);
        expect(mockClose).not.toHaveBeenCalled();
    });
});
