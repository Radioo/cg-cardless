import {requireNativeModule} from 'expo-modules-core';

type FelicaStatus = {
    isEmulationActive: boolean;
    currentIdm: string | null;
    currentSystemCode: string | null;
};

type FelicaEmulatorModuleType = {
    isHceFSupported(): boolean;
    isNfcEnabled(): boolean;
    getStatus(): FelicaStatus;
    setIdm(idm: string): Promise<boolean>;
    setSystemCode(code: string): Promise<boolean>;
    enableEmulation(): Promise<boolean>;
    disableEmulation(): Promise<void>;
};

export default requireNativeModule<FelicaEmulatorModuleType>('FelicaEmulator');
