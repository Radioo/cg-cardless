import {test, expect} from '@playwright/test';

test.describe('Home page', () => {
    test('shows Settings button', async ({page}) => {
        await page.goto('/');
        await expect(page.locator('[tabindex="0"]', {hasText: 'Settings'})).toBeVisible();
    });

    test('shows warning banner when no card is saved', async ({page}) => {
        await page.goto('/');
        await expect(
            page.getByText('No card saved. Please go to Settings to add your card.'),
        ).toBeVisible();
    });

    test('clicking Settings navigates to settings page', async ({page}) => {
        await page.goto('/');
        await page.locator('[tabindex="0"]', {hasText: 'Settings'}).click();
        await expect(page.getByPlaceholder('Enter your card')).toBeVisible();
    });
});
