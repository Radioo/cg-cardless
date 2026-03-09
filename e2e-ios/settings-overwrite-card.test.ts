import { device, element, by, expect } from 'detox';

describe('Settings - Overwrite Card', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
        await element(by.id('settings-btn')).tap();
    });

    it('overwrites an existing card with a new one', async () => {
        // Save first card
        await element(by.id('card-input')).typeText('02FE000000000001');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();
        await expect(element(by.id('dialog-title'))).toHaveText('Saved');
        await element(by.id('dialog-ok-btn')).tap();

        // Verify first card is shown
        await expect(element(by.id('card-id-value'))).toHaveText('02FE000000000001');

        // Clear and enter new card
        await element(by.id('card-input')).clearText();
        await element(by.id('card-input')).typeText('02FEAABBCCDDEEFF');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();
        await expect(element(by.id('dialog-title'))).toHaveText('Saved');
        await element(by.id('dialog-ok-btn')).tap();

        // Verify new card replaces old one
        await expect(element(by.id('card-id-value'))).toHaveText('02FEAABBCCDDEEFF');
    });
});
