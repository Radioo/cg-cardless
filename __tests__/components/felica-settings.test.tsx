import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { FelicaEmulator } from '@/modules/felica-emulator';
import { FelicaSettings } from '@/components/felica-settings';
import { createWrapper } from '../helpers';

const originalPlatformOS = Platform.OS;

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    Platform.OS = originalPlatformOS;
});

describe('FelicaSettings', () => {
    it('returns null on non-android platforms', async () => {
        Platform.OS = 'ios' as typeof Platform.OS;

        const { toJSON } = render(<FelicaSettings savedCard={null} />, {
            wrapper: createWrapper(),
        });

        await act(async () => {});
        expect(toJSON()).toBeNull();
    });

    it('returns null when HCE-F is not supported', async () => {
        Platform.OS = 'android' as typeof Platform.OS;
        (FelicaEmulator.isHceFSupported as jest.Mock).mockReturnValue(false);

        const { toJSON } = render(<FelicaSettings savedCard={null} />, {
            wrapper: createWrapper(),
        });

        await act(async () => {});
        expect(toJSON()).toBeNull();
    });

    it('renders when on android and HCE-F is supported', async () => {
        Platform.OS = 'android' as typeof Platform.OS;
        (FelicaEmulator.isHceFSupported as jest.Mock).mockReturnValue(true);
        (FelicaEmulator.isNfcEnabled as jest.Mock).mockReturnValue(true);

        const { getByText } = render(<FelicaSettings savedCard={null} />, {
            wrapper: createWrapper(),
        });

        await act(async () => {});
        expect(getByText('FeliCa Emulation')).toBeTruthy();
    });
});
