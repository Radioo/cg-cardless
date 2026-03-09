import { device, element, by, expect } from 'detox';

describe('Settings - Invalid Card', () => {
    beforeEach(async () => {
        await device.launchApp({ newInstance: true, delete: true });
        await element(by.id('settings-btn')).tap();
    });

    it('shows error for empty card', async () => {
        await element(by.id('save-card-btn')).tap();

        await expect(element(by.id('dialog-title'))).toHaveText('Error');
        await expect(element(by.id('dialog-message'))).toHaveText('Card cannot be empty');
        await element(by.id('dialog-ok-btn')).tap();
    });

    it('shows error for card that is too short', async () => {
        await element(by.id('card-input')).typeText('ABC');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();

        await expect(element(by.id('dialog-title'))).toHaveText('Error');
        await expect(element(by.id('dialog-message'))).toHaveText('Card must be 16 characters long');
        await element(by.id('dialog-ok-btn')).tap();
    });

    it('shows error for invalid format card', async () => {
        await element(by.id('card-input')).typeText('IIIIIIIIIIIIIIII');
        await element(by.id('card-input')).tapReturnKey();
        await element(by.id('save-card-btn')).tap();

        await expect(element(by.id('dialog-title'))).toHaveText('Error');
        await element(by.id('dialog-ok-btn')).tap();
    });
});
