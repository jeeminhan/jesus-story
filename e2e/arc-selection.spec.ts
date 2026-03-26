import { test, expect } from '@playwright/test';

test('emotional entry screen shows five human-word choices', async ({ page }) => {
  await page.goto('/en');
  for (const key of ['grief', 'doubt', 'searching', 'curiosity', 'anger']) {
    await expect(page.getByRole('button', { name: new RegExp(`choose ${key}`, 'i') })).toBeVisible();
  }
});

test('emotional entry screen asks the planned question', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: /what are you carrying right now/i })).toBeVisible();
  await expect(page.getByText(/the story will meet you there/i)).toBeVisible();
});

test('different emotional choices route to different authored arcs', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: /choose grief/i }).click();
  await expect(page).toHaveURL(/\/en\/when-he-wept\?scene=/);
});
