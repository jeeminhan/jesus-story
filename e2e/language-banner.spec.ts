import { expect, test } from '@playwright/test';

test('receiver surfaces stay free of language banner chrome', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await expect(page.getByRole('banner')).toHaveCount(0);
});
