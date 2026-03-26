import { expect, test } from '@playwright/test';

test('home page redirects to the emotional entry experience', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL('/en');
  await expect(page.getByRole('heading', { name: /what are you carrying right now/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /choose grief/i })).toBeVisible();
});

test('emotional entry goes straight into the first scene', async ({ page }) => {
  await page.goto('/en');

  await page.getByRole('button', { name: /choose searching/i }).click();
  await expect(page).toHaveURL(/\/en\/the-king-who-came\?scene=/);
  await expect(page.getByRole('heading', { name: 'The Waiting' })).toBeVisible();
});
