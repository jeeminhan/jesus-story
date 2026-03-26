import { expect, test } from '@playwright/test';

test('witness page shows post-mirror path context and actions', async ({ page }) => {
  await page.goto('/en/the-king-who-came/witness');

  await expect(page.getByText(/someone who's been there/i)).toBeVisible();
  await expect(page.getByText(/searching path · same story/i)).toBeVisible();
  await expect(page.getByText(/a witness/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /skip witness video/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /tell me about the story/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /leave a message for someone/i })).toBeVisible();
});

test('witness page falls back gracefully when video fails', async ({ page }) => {
  await page.goto('/en/the-king-who-came/witness');
  await page.locator('video').dispatchEvent('error');

  await expect(page.getByText(/we couldn't load this right now/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /tell me about the story/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /i want to sit with this/i })).toBeVisible();
  await page.getByRole('button', { name: /leave a message for someone/i }).click();
  await expect(page).toHaveURL(/\/connect$/);
});
