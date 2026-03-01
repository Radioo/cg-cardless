import {useState, useCallback, useEffect, useMemo} from 'react';
import {Platform} from 'react-native';
import {FelicaEmulator} from '@/modules/felica-emulator';
import {isHceFCompatible} from '@/utils/card';

const SYSTEM_CODE = '4000';

export function useFelicaEmulation(savedCard: string | null | undefined) {
    const [isSupported, setIsSupported] = useState(false);
    const [isNfcEnabled, setIsNfcEnabled] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canEmulate = useMemo(
        () => !!savedCard && isHceFCompatible(savedCard),
        [savedCard],
    );

    useEffect(() => {
        if (Platform.OS !== 'android') {
            return;
        }
        setIsSupported(FelicaEmulator.isHceFSupported());
        setIsNfcEnabled(FelicaEmulator.isNfcEnabled());
        const status = FelicaEmulator.getStatus();
        setIsActive(status.isEmulationActive);
    }, []);

    const enable = useCallback(async () => {
        if (!savedCard || !isHceFCompatible(savedCard)) {
            setError('Card must start with 02FE to be emulated via HCE-F.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const idmOk = await FelicaEmulator.setIdm(savedCard.toUpperCase());
            if (!idmOk) {
                throw new Error('Failed to set IDm');
            }

            const scOk = await FelicaEmulator.setSystemCode(SYSTEM_CODE);
            if (!scOk) {
                throw new Error('Failed to set system code');
            }

            const enabled = await FelicaEmulator.enableEmulation();
            if (!enabled) {
                throw new Error('Failed to enable emulation');
            }

            setIsActive(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [savedCard]);

    const disable = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await FelicaEmulator.disableEmulation();
            setIsActive(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isSupported,
        isNfcEnabled,
        isActive,
        canEmulate,
        loading,
        error,
        enable,
        disable,
    };
}
