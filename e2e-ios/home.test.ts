import { device, element, by, expect } from 'detox';

describe('Home', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
    });

    it('shows warning banner when no card is saved', async () => {
        await expect(element(by.id('no-card-warning'))).toBeVisible();
    });

    it('shows Settings button', async () => {
        await expect(element(by.id('settings-btn'))).toBeVisible();
    });

    it('shows Flip camera button', async () => {
        await device.launchApp({ newInstance: true, delete: true, permissions: { camera: 'YES' } });
        await expect(element(by.text('Flip camera'))).toBeVisible();
    });
});
