import { device, element, by, expect } from 'detox';

describe('Settings - Generate Card', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
        await element(by.id('settings-btn')).tap();
    });

    it('generates and saves a card', async () => {
        // Tap Generate Card to populate input
        await element(by.id('generate-card-btn')).tap();

        // Save the generated card
        await element(by.id('save-card-btn')).tap();

        // Verify success dialog
        await expect(element(by.id('dialog-title'))).toHaveText('Saved');
        await expect(element(by.id('dialog-message'))).toHaveText('Card saved successfully.');

        // Dismiss dialog
        await element(by.id('dialog-ok-btn')).tap();

        // Verify card info is displayed after saving generated card
        await expect(element(by.text('Card ID'))).toBeVisible();
        await expect(element(by.id('display-id-label'))).toBeVisible();
    });
});
