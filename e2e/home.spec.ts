import { expect, test } from '@playwright/test';

test('home page restores the original overview and links to the current prototype', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /see the mockup first/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /open mockup/i })).toHaveAttribute('href', '/ux-design-directions.html');
  await expect(page.getByRole('link', { name: /open live app/i })).toHaveAttribute('href', '/en');
  await expect(page.getByRole('link', { name: /open current prototype/i })).toHaveAttribute('href', '/prototype');
});

test('prototype page remains available from its own route', async ({ page }) => {
  await page.goto('/prototype');

  await expect(page.getByRole('heading', { name: /build the door before asking anyone to walk through it/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /open coordinator desk/i })).toHaveAttribute('href', '/coordinator');
});

test('emotional entry goes straight into the first scene', async ({ page }) => {
  await page.goto('/en');

  await page.getByRole('button', { name: /choose searching/i }).click();
  await expect(page).toHaveURL(/\/en\/the-king-who-came\?scene=/);
  await expect(page.getByRole('heading', { name: 'The Waiting' })).toBeVisible();
});
