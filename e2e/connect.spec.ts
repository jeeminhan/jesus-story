import { expect, test } from '@playwright/test';

test('connect form restores a local draft after reload', async ({ page }) => {
  await page.goto('/en/the-king-who-came/connect');

  await page.getByLabel(/what are you thinking right now/i).fill('I am not ready to explain all of this yet.');
  await page.getByRole('button', { name: /yes, give me a link/i }).click();
  await page.reload();

  await expect(page.getByLabel(/what are you thinking right now/i)).toHaveValue(
    'I am not ready to explain all of this yet.',
  );
  await expect(page.getByRole('button', { name: /yes, give me a link/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/saved quietly on this device/i)).toBeVisible();
});
