import { device, element, by, expect } from 'detox';

describe('Card Persists After Relaunch', () => {
    beforeAll(async () => {
        await device.launchApp({ newInstance: true, delete: true });
    });

    it('saves a card, relaunches, and card is still there', async () => {
        // Save a card
        await element(by.id('settings-btn')).tap();
        await element(by.id('card-input')).typeText('02FE000000000001');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();
        await expect(element(by.id('dialog-title'))).toHaveText('Saved');
        await element(by.id('dialog-ok-btn')).tap();
        await element(by.id('back-btn')).tap();

        // Verify no warning banner (card is saved)
        await expect(element(by.id('no-card-warning'))).not.toBeVisible();

        // Relaunch the app WITHOUT clearing state
        await device.launchApp({ newInstance: true });

        // Warning banner should still not be visible (card persisted)
        await expect(element(by.id('no-card-warning'))).not.toBeVisible();

        // Verify card info is still in settings
        await element(by.id('settings-btn')).tap();
        await expect(element(by.id('card-id-value'))).toHaveText('02FE000000000001');
    });
});
