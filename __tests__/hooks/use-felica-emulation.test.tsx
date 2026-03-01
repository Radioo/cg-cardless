import {renderHook, act} from '@testing-library/react-native';
import {Platform} from 'react-native';
import {useFelicaEmulation} from '@/hooks/use-felica-emulation';

jest.mock('@/modules/felica-emulator', () => ({
    FelicaEmulator: {
        isHceFSupported: jest.fn(() => true),
        isNfcEnabled: jest.fn(() => true),
        getStatus: jest.fn(() => ({isEmulationActive: false, currentIdm: null, currentSystemCode: null})),
        setIdm: jest.fn(() => Promise.resolve(true)),
        setSystemCode: jest.fn(() => Promise.resolve(true)),
        enableEmulation: jest.fn(() => Promise.resolve(true)),
        disableEmulation: jest.fn(() => Promise.resolve()),
    },
}));

const {FelicaEmulator} = jest.requireMock('@/modules/felica-emulator');

beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
});

describe('useFelicaEmulation', () => {
    it('detects support and NFC on android', () => {
        const {result} = renderHook(() => useFelicaEmulation('02FE000000000001'));
        expect(result.current.isSupported).toBe(true);
        expect(result.current.isNfcEnabled).toBe(true);
    });

    it('reports no support on non-android', () => {
        Platform.OS = 'ios';
        const {result} = renderHook(() => useFelicaEmulation('02FE000000000001'));
        expect(result.current.isSupported).toBe(false);
    });

    it('reports canEmulate for HCE-F compatible cards', () => {
        const {result} = renderHook(() => useFelicaEmulation('02FE000000000001'));
        expect(result.current.canEmulate).toBe(true);
    });

    it('reports cannot emulate for incompatible cards', () => {
        const {result} = renderHook(() => useFelicaEmulation('E00401000008F3E3'));
        expect(result.current.canEmulate).toBe(false);
    });

    it('enables emulation successfully', async () => {
        const {result} = renderHook(() => useFelicaEmulation('02FE000000000001'));

        await act(async () => {
            await result.current.enable();
        });

        expect(FelicaEmulator.setIdm).toHaveBeenCalledWith('02FE000000000001');
        expect(FelicaEmulator.setSystemCode).toHaveBeenCalledWith('4000');
        expect(FelicaEmulator.enableEmulation).toHaveBeenCalled();
        expect(result.current.isActive).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('sets error when enable fails', async () => {
        FelicaEmulator.enableEmulation.mockResolvedValueOnce(false);
        const {result} = renderHook(() => useFelicaEmulation('02FE000000000001'));

        await act(async () => {
            await result.current.enable();
        });

        expect(result.current.isActive).toBe(false);
        expect(result.current.error).toBe('Failed to enable emulation');
    });

    it('sets error for non-HCE-F card on enable', async () => {
        const {result} = renderHook(() => useFelicaEmulation('E00401000008F3E3'));

        await act(async () => {
            await result.current.enable();
        });

        expect(result.current.error).toMatch(/02FE/);
    });

    it('disables emulation successfully', async () => {
        const {result} = renderHook(() => useFelicaEmulation('02FE000000000001'));

        await act(async () => {
            await result.current.enable();
        });
        await act(async () => {
            await result.current.disable();
        });

        expect(FelicaEmulator.disableEmulation).toHaveBeenCalled();
        expect(result.current.isActive).toBe(false);
    });
});
