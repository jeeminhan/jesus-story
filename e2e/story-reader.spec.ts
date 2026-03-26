import { expect, test } from '@playwright/test';

test('deep link art card remains the receiver entry surface', async ({ page }) => {
  await page.goto('/en/the-king-who-came');

  await expect(page.getByRole('main', { name: /story entry/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /tap anywhere to begin/i })).toBeVisible();
});

test('story reader loads first scene and shows choices', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await page.getByRole('button', { name: /tap anywhere to begin/i }).click();

  await expect(page.locator('[aria-labelledby="scene-title"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The Waiting' })).toBeVisible();
  await expect(page.getByText(/world was broken/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /tap scene to continue/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /open full text/i })).toHaveCount(0);
});

test('story reader can expand long text by tapping the preview panel', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await page.getByRole('button', { name: /tap anywhere to begin/i }).click();

  await page.getByRole('heading', { name: 'The Waiting' }).click();

  await expect(page.getByRole('button', { name: /collapse full text/i })).toBeVisible();
  await expect(page.getByText(/and the world waited/i)).toBeVisible();
});

test('story reader can dock the text panel and restore it with the floating handle', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await page.getByRole('button', { name: /tap anywhere to begin/i }).click();

  await page.getByRole('button', { name: /slide text panel down/i }).click();
  await expect(page.getByRole('button', { name: /slide up text panel/i })).toBeVisible();

  await page.getByRole('button', { name: /slide up text panel/i }).click();
  await expect(page.getByRole('heading', { name: 'The Waiting' })).toBeVisible();
});

test('tapping the scene navigates forward for single-path scenes', async ({ page }) => {
  await page.goto('/en/the-king-who-came');
  await page.getByRole('button', { name: /tap anywhere to begin/i }).click();

  await page.getByRole('button', { name: /tap scene to continue/i }).click();
  await expect(page.getByRole('heading', { name: 'A Different Kind of King' })).toBeVisible();
  await expect(page).toHaveURL(/scene=/);
});
