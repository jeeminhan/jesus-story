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

test('share preview updates when a different scene is selected', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');

  await page.getByRole('button', { name: /the rescue/i }).click();
  await expect(page.getByTestId('share-preview-title')).toHaveText('The Rescue');
});

test('share page includes newly added story frames', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');

  await page.getByRole('button', { name: /the opened way/i }).click();
  await expect(page.getByTestId('share-preview-title')).toHaveText('The Opened Way');
});

test('scene-specific bridge card still opens on the art-card surface first', async ({ page }) => {
  await page.goto('/en/the-king-who-came?scene=scene-searching-6&card=1');

  await expect(page.getByRole('main', { name: /story entry/i })).toBeVisible();
  await page.getByRole('button', { name: /tap anywhere to begin/i }).click();
  await expect(page.getByRole('heading', { name: 'The Rescue' })).toBeVisible();
});
