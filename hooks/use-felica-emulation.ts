import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Platform } from 'react-native';
import { FelicaEmulator } from '@/modules/felica-emulator';
import { isHceFCompatible } from '@/utils/card';
import { FelicaEmulationError } from '@/utils/felica';

const SYSTEM_CODE = '4000';

function toFelicaError(e: unknown): FelicaEmulationError {
    if (e instanceof FelicaEmulationError) {
        return e;
    }
    return new FelicaEmulationError(e instanceof Error ? e.message : 'Unknown error');
}

async function requireSuccess(fn: () => Promise<boolean>, errorMsg: string): Promise<void> {
    const ok = await fn();
    if (!ok) {
        throw new FelicaEmulationError(errorMsg);
    }
}

function ensureModule(): NonNullable<typeof FelicaEmulator> {
    if (!FelicaEmulator) {
        throw new FelicaEmulationError('FelicaEmulator module is not available');
    }
    return FelicaEmulator;
}

async function startEmulation(cardId: string): Promise<void> {
    const mod = ensureModule();
    await requireSuccess(() => mod.setIdm(cardId.toUpperCase()), 'Failed to set IDm');
    await requireSuccess(() => mod.setSystemCode(SYSTEM_CODE), 'Failed to set system code');
    await requireSuccess(() => mod.enableEmulation(), 'Failed to enable emulation');
}

async function stopEmulation(): Promise<void> {
    const mod = ensureModule();
    await requireSuccess(() => mod.disableEmulation(), 'Failed to disable emulation');
}

function detectCapabilities(): { supported: boolean; nfcEnabled: boolean; active: boolean } {
    if (Platform.OS !== 'android' || !FelicaEmulator) {
        return { supported: false, nfcEnabled: false, active: false };
    }
    return {
        supported: FelicaEmulator.isHceFSupported(),
        nfcEnabled: FelicaEmulator.isNfcEnabled(),
        active: FelicaEmulator.getStatus().isEmulationActive,
    };
}

type EmulationState = {
    isActive: boolean;
    loading: boolean;
    error: FelicaEmulationError | null;
};

type EmulationAction =
    | { type: 'start' }
    | { type: 'success'; isActive: boolean }
    | { type: 'error'; error: FelicaEmulationError };

function emulationReducer(state: EmulationState, action: EmulationAction): EmulationState {
    switch (action.type) {
    case 'start':
        return { ...state, loading: true, error: null };
    case 'success':
        return { isActive: action.isActive, loading: false, error: null };
    case 'error':
        return { ...state, loading: false, error: action.error };
    }
}

const initialState: EmulationState = {
    isActive: false,
    loading: false,
    error: null,
};

export function useFelicaEmulation(savedCard: string | null | undefined) {
    const [isSupported, setIsSupported] = useState(false);
    const [isNfcEnabled, setIsNfcEnabled] = useState(false);
    const [state, dispatch] = useReducer(emulationReducer, initialState);

    const canEmulate = useMemo(
        () => !!savedCard && isHceFCompatible(savedCard),
        [savedCard],
    );

    useEffect(() => {
        const caps = detectCapabilities();
        setIsSupported(caps.supported);
        setIsNfcEnabled(caps.nfcEnabled);
        if (caps.active) {
            dispatch({ type: 'success', isActive: true });
        }
    }, []);

    const executeEmulationStep = useCallback(
        async (operation: () => Promise<void>, activeAfter: boolean) => {
            dispatch({ type: 'start' });
            try {
                await operation();
                dispatch({ type: 'success', isActive: activeAfter });
            } catch (e) {
                dispatch({ type: 'error', error: toFelicaError(e) });
            }
        },
        [],
    );

    const enable = useCallback(() => {
        if (!canEmulate || !savedCard) {
            dispatch({ type: 'error', error: new FelicaEmulationError('Card must start with 02FE to be emulated via HCE-F.') });
            return;
        }
        executeEmulationStep(() => startEmulation(savedCard), true);
    }, [canEmulate, savedCard, executeEmulationStep]);

    const disable = useCallback(
        () => executeEmulationStep(stopEmulation, false),
        [executeEmulationStep],
    );

    return {
        isSupported,
        isNfcEnabled,
        isActive: state.isActive,
        canEmulate,
        loading: state.loading,
        error: state.error,
        enable,
        disable,
    };
}
