import { device, element, by, expect } from 'detox';

describe('Warning Banner After Save', () => {
    beforeAll(async () => {
        await device.launchApp({ newInstance: true, delete: true });
    });

    it('hides warning banner after saving a card', async () => {
        // Verify warning banner shows on home screen
        await expect(element(by.id('no-card-warning'))).toBeVisible();

        // Navigate to Settings and save a card
        await element(by.id('settings-btn')).tap();
        await element(by.id('card-input')).typeText('02FE000000000001');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();

        // Dismiss success dialog
        await expect(element(by.id('dialog-title'))).toHaveText('Saved');
        await element(by.id('dialog-ok-btn')).tap();

        // Go back to home
        await element(by.id('back-btn')).tap();

        // Warning banner should no longer be visible
        await expect(element(by.id('no-card-warning'))).not.toBeVisible();
    });
});
