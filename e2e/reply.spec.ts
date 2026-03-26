import { expect, test } from '@playwright/test';

test('valid mock reply token shows message', async ({ page }) => {
  await page.goto('/reply/mock-reply-token');
  await expect(page.getByText('No reply yet')).toBeVisible();
});

test('invalid reply token shows link not found', async ({ page }) => {
  await page.goto('/reply/invalid-token-xyz');
  await expect(page.getByText('Link not found')).toBeVisible();
});
