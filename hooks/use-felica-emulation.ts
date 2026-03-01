import {useState, useCallback, useEffect, useMemo} from 'react';
import {Platform} from 'react-native';
import {FelicaEmulator} from '@/modules/felica-emulator';
import {isFelicaCard} from '@/utils/card';

const DEFAULT_SYSTEM_CODE = '4000';

/**
 * Derives the HCE-F IDm from a FeliCa card ID.
 * FeliCa card IDs are 16 hex chars and ARE the IDm.
 * HCE-F restriction: IDm must start with 02FE, so we replace the
 * first 4 hex chars and keep the remaining 12 (the unique part).
 */
function cardIdToIdm(cardId: string): string {
    return '02FE' + cardId.slice(4).toUpperCase();
}

export function useFelicaEmulation(savedCard: string | null | undefined) {
    const [isSupported, setIsSupported] = useState(false);
    const [isNfcEnabled, setIsNfcEnabled] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [systemCode, setSystemCode] = useState(DEFAULT_SYSTEM_CODE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isFelica = useMemo(
        () => !!savedCard && isFelicaCard(savedCard),
        [savedCard],
    );

    useEffect(() => {
        if (Platform.OS !== 'android') return;
        setIsSupported(FelicaEmulator.isHceFSupported());
        setIsNfcEnabled(FelicaEmulator.isNfcEnabled());
        const status = FelicaEmulator.getStatus();
        setIsActive(status.isEmulationActive);
        if (status.currentSystemCode) setSystemCode(status.currentSystemCode);
    }, []);

    const enable = useCallback(async () => {
        if (!savedCard) {
            setError('No card saved');
            return;
        }
        if (!isFelicaCard(savedCard)) {
            setError('Saved card is not a FeliCa card. Only FeliCa cards can be emulated.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const idm = cardIdToIdm(savedCard);
            const idmOk = await FelicaEmulator.setIdm(idm);
            if (!idmOk) throw new Error('Failed to set IDm');

            const scOk = await FelicaEmulator.setSystemCode(systemCode);
            if (!scOk) throw new Error('Failed to set system code');

            const enabled = await FelicaEmulator.enableEmulation();
            if (!enabled) throw new Error('Failed to enable emulation');

            setIsActive(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [savedCard, systemCode]);

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
        isFelica,
        systemCode,
        setSystemCode,
        loading,
        error,
        enable,
        disable,
    };
}
