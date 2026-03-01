import {test, expect} from '@playwright/test';

test.describe('Settings page', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/settings');
    });

    test('shows Settings title and card input', async ({page}) => {
        await expect(page.getByText('Settings', {exact: true}).first()).toBeVisible();
        await expect(page.getByPlaceholder('Enter your card')).toBeVisible();
    });

    test('can type a card ID into the input field', async ({page}) => {
        const input = page.getByPlaceholder('Enter your card');
        await input.fill('02FE000000000001');
        await expect(input).toHaveValue('02FE000000000001');
    });

    test('Generate Card button populates the input', async ({page}) => {
        const input = page.getByPlaceholder('Enter your card');
        await expect(input).toHaveValue('');
        await page.locator('[tabindex="0"]', {hasText: 'Generate Card'}).click();
        await expect(input).not.toHaveValue('');
    });

    test('Save Card saves and displays card info', async ({page}) => {
        page.on('dialog', (dialog) => dialog.accept());

        const input = page.getByPlaceholder('Enter your card');
        await input.fill('02FE000000000001');
        await page.locator('[tabindex="0"]', {hasText: 'Save Card'}).click();

        await expect(page.getByText('Card ID', {exact: true})).toBeVisible();
        await expect(page.getByText('Display ID', {exact: true})).toBeVisible();
    });

    test('Back button navigates back to home', async ({page}) => {
        // Navigate from home first so there's history to go back to
        await page.goto('/');
        await page.locator('[tabindex="0"]', {hasText: 'Settings'}).click();
        await expect(page.getByPlaceholder('Enter your card')).toBeVisible();

        await page.locator('[tabindex="0"]', {hasText: 'Back'}).click();
        await expect(
            page.getByText('No card saved. Please go to Settings to add your card.'),
        ).toBeVisible();
    });

    test('warning banner disappears after saving a card', async ({page}) => {
        page.on('dialog', (dialog) => dialog.accept());

        // Save a card
        await page.getByPlaceholder('Enter your card').fill('02FE000000000001');
        await page.locator('[tabindex="0"]', {hasText: 'Save Card'}).click();
        await expect(page.getByText('Card ID', {exact: true})).toBeVisible();

        // Navigate home
        await page.locator('[tabindex="0"]', {hasText: 'Back'}).click();

        // Warning should be gone
        await expect(
            page.getByText('No card saved. Please go to Settings to add your card.'),
        ).not.toBeVisible();
    });
});
