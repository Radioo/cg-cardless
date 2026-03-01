import type {FelicaStatus} from './FelicaEmulatorModule';

export default {
    isHceFSupported(): boolean {
        return false;
    },
    isNfcEnabled(): boolean {
        return false;
    },
    getStatus(): FelicaStatus {
        return {isEmulationActive: false, currentIdm: null, currentSystemCode: null};
    },
    async setIdm(_idm: string): Promise<boolean> {
        return false;
    },
    async setSystemCode(_code: string): Promise<boolean> {
        return false;
    },
    async enableEmulation(): Promise<boolean> {
        return false;
    },
    async disableEmulation(): Promise<void> {},
};
