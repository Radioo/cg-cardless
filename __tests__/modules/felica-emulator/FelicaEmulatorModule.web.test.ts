import FelicaEmulatorWeb from '@/modules/felica-emulator/src/FelicaEmulatorModule.web';

describe('FelicaEmulatorModule.web', () => {
    it('reports HCE-F as unsupported', () => {
        expect(FelicaEmulatorWeb.isHceFSupported()).toBe(false);
    });

    it('reports NFC as disabled', () => {
        expect(FelicaEmulatorWeb.isNfcEnabled()).toBe(false);
    });

    it('returns inactive status with null fields', () => {
        expect(FelicaEmulatorWeb.getStatus()).toEqual({
            isEmulationActive: false,
            currentIdm: null,
            currentSystemCode: null,
        });
    });

    it('returns false for setIdm', async () => {
        expect(await FelicaEmulatorWeb.setIdm('test')).toBe(false);
    });

    it('returns false for setSystemCode', async () => {
        expect(await FelicaEmulatorWeb.setSystemCode('test')).toBe(false);
    });

    it('returns false for enableEmulation', async () => {
        expect(await FelicaEmulatorWeb.enableEmulation()).toBe(false);
    });

    it('returns false for disableEmulation', async () => {
        expect(await FelicaEmulatorWeb.disableEmulation()).toBe(false);
    });
});
