import { expect, test } from '@playwright/test';

test('community connection page shows form', async ({ page }) => {
  await page.goto('/en/the-king-who-came/connect');

  await expect(page.getByRole('heading', { name: /if you want, you can leave this with someone real/i })).toBeVisible();
  await expect(page.getByText(/sarah will read what you write/i)).toBeVisible();
  await expect(page.getByLabel(/what are you thinking right now/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /yes, give me a link/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /no, just pass it along/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /not yet/i })).toBeVisible();
});

test('submitting form shows thank you message', async ({ page }) => {
  await page.goto('/en/the-king-who-came/connect');

  await page.getByLabel(/what are you thinking right now/i).fill('I have questions.');
  await page.getByRole('button', { name: /yes, give me a link/i }).click();
  await page.getByRole('button', { name: /send my story/i }).click();

  await expect(page.getByText('A real person will read this.')).toBeVisible();
  await expect(page.getByRole('link', { name: /check for a reply/i })).toBeVisible();
});
