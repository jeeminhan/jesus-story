import { expect, test } from '@playwright/test';

test('home page shows the ux design mockup before entering the live app', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /see the bmad mockup first/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /open bmad mockup/i })).toBeVisible();
  await page.getByRole('link', { name: /open live app/i }).click();
  await expect(page).toHaveURL('/en');
  await expect(page.getByRole('heading', { name: /choose a door/i })).toBeVisible();
});

test('emotional entry goes straight into the first scene', async ({ page }) => {
  await page.goto('/en');

  await page.getByRole('button', { name: /choose searching/i }).click();
  await expect(page).toHaveURL(/\/en\/the-king-who-came\?scene=/);
  await expect(page.getByRole('heading', { name: 'The Waiting' })).toBeVisible();
});
