import { device, element, by, expect } from 'detox';

describe('Settings - Save Card', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
        await element(by.id('settings-btn')).tap();
    });

    it('saves a valid FeliCa card', async () => {
        await element(by.id('card-input')).typeText('02FE000000000001');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();

        // Verify success dialog
        await expect(element(by.id('dialog-title'))).toHaveText('Saved');
        await expect(element(by.id('dialog-message'))).toHaveText('Card saved successfully.');

        // Dismiss dialog
        await element(by.id('dialog-ok-btn')).tap();

        // Verify card info is displayed
        await expect(element(by.id('card-id-value'))).toHaveText('02FE000000000001');
        await expect(element(by.id('display-id-label'))).toBeVisible();
    });
});
