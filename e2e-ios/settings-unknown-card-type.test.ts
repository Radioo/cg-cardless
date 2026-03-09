import { device, element, by, expect } from 'detox';

describe('Settings - Unknown Card Type', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
        await element(by.id('settings-btn')).tap();
    });

    it('shows error for unknown card type', async () => {
        await element(by.id('card-input')).typeText('AAAAAAAAAAAAAAAA');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();

        await expect(element(by.id('dialog-title'))).toHaveText('Error');
        await expect(element(by.id('dialog-message'))).toHaveText('Unknown card type');
        await element(by.id('dialog-ok-btn')).tap();
    });
});
