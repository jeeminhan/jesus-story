import { expect, test } from '@playwright/test';

test('mirror moment shows the three receiver-first paths', async ({ page }) => {
  await page.goto('/en/the-king-who-came?scene=scene-searching-7');

  await expect(page.getByText(/you came in searching\. you met the king who came\./i)).toBeVisible();
  await expect(page.getByRole('button', { name: /tell me more/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /talk to someone/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /sit with this/i })).toBeVisible();
});
