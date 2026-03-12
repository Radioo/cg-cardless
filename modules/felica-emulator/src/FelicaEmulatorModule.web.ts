export default {
    isHceFSupported(): boolean {
        return false;
    },
    isNfcEnabled(): boolean {
        return false;
    },
    getStatus() {
        return {isEmulationActive: false, currentIdm: null, currentSystemCode: null} as const;
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
    async disableEmulation(): Promise<boolean> {
        return false;
    },
};
