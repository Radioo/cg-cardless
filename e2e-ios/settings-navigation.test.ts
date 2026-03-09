import { device, element, by, expect } from 'detox';

describe('Settings Navigation', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
    });

    it('navigates to Settings and back', async () => {
        // Navigate to Settings from Home
        await element(by.id('settings-btn')).tap();

        // Verify Settings screen elements
        await expect(element(by.text('Settings'))).toBeVisible();
        await expect(element(by.text('Card'))).toBeVisible();
        await expect(element(by.text('Enter a Card ID (hex) or Display ID'))).toBeVisible();
        await expect(element(by.id('generate-card-btn'))).toBeVisible();
        await expect(element(by.id('save-card-btn'))).toBeVisible();
        await expect(element(by.id('back-btn'))).toBeVisible();

        // Navigate back to Home
        await element(by.id('back-btn')).tap();

        // Verify we're back on the home screen
        await expect(element(by.id('no-card-warning'))).toBeVisible();
        await expect(element(by.id('settings-btn'))).toBeVisible();
    });
});
