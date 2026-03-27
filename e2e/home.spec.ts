import { expect, test } from '@playwright/test';

test('home page shows the ux design mockup before entering the live app', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /see the bmad mockup first/i })).toBeVisible();
  const designFrame = page.frameLocator('iframe[title="UX design directions"]');
  await expect(page.locator('iframe[title="UX design directions"]')).toBeVisible();
  await expect(designFrame.getByText(/gospel story .* design directions/i)).toBeVisible();
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
