import { expect, test } from '@playwright/test';

test('carrier can navigate to share page', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');
  await expect(page.getByText('Choose a moment')).toBeVisible();
});

test('share page has scene selector', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');

  const firstScene = page.locator('[aria-pressed="true"]').first();
  await expect(firstScene).toBeVisible();
});
