import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { QrScanner } from '@/components/qr-scanner';
import { useCameraPermissions } from 'expo-camera';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: mockPush,
        back: jest.fn(),
        replace: jest.fn(),
    })),
    useLocalSearchParams: jest.fn(() => ({})),
}));

beforeEach(() => {
    mockPush.mockClear();
    (useCameraPermissions as jest.Mock).mockReturnValue([
        { granted: true, canAskAgain: true },
        jest.fn(),
    ]);
});

describe('QrScanner', () => {
    it('shows grant button when permission not granted', () => {
        (useCameraPermissions as jest.Mock).mockReturnValue([
            { granted: false, canAskAgain: true },
            jest.fn(),
        ]);

        const { getByText } = render(<QrScanner cardId="E00401000008F3E3" />);
        expect(getByText('Grant permission')).toBeTruthy();
    });

    it('requests permission when grant button pressed', () => {
        const requestPermission = jest.fn();
        (useCameraPermissions as jest.Mock).mockReturnValue([
            { granted: false, canAskAgain: true },
            requestPermission,
        ]);

        const { getByText } = render(<QrScanner cardId="E00401000008F3E3" />);
        fireEvent.press(getByText('Grant permission'));
        expect(requestPermission).toHaveBeenCalled();
    });

    it('shows camera view when permission granted', () => {
        const { getByText } = render(<QrScanner cardId="E00401000008F3E3" />);
        expect(getByText('Flip camera')).toBeTruthy();
    });

    it('shows error on invalid QR code', () => {
        let capturedOnBarcodeScanned: ((result: { data: string }) => void) | undefined;

        jest.spyOn(require('expo-camera'), 'CameraView').mockImplementation(
            (props: { onBarcodeScanned?: (result: { data: string }) => void }) => {
                capturedOnBarcodeScanned = props.onBarcodeScanned;
                const { View } = require('react-native');
                return <View testID="camera" />;
            },
        );

        const { getByText } = render(<QrScanner cardId="E00401000008F3E3" />);

        act(() => {
            capturedOnBarcodeScanned?.({ data: 'not-a-valid-qr' });
        });

        expect(getByText('Invalid QR code')).toBeTruthy();
    });

    it('navigates on valid QR code', () => {
        let capturedOnBarcodeScanned: ((result: { data: string }) => void) | undefined;

        jest.spyOn(require('expo-camera'), 'CameraView').mockImplementation(
            (props: { onBarcodeScanned?: (result: { data: string }) => void }) => {
                capturedOnBarcodeScanned = props.onBarcodeScanned;
                const { View } = require('react-native');
                return <View testID="camera" />;
            },
        );

        const validUrl = 'https://example.com/sppass/' + 'a'.repeat(64);

        const { queryByText } = render(<QrScanner cardId="E00401000008F3E3" />);

        act(() => {
            capturedOnBarcodeScanned?.({ data: validUrl });
        });

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/scan-result',
            params: { url: validUrl },
        });
        expect(queryByText('Invalid QR code')).toBeNull();
    });
});
