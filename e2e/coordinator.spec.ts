import { expect, test } from '@playwright/test';

test('coordinator dashboard lists incoming messages with context', async ({ page }) => {
  await page.goto('/coordinator');

  await expect(page.getByRole('heading', { name: /read each message with context/i })).toBeVisible();
  await expect(page.getByText(/searching path/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /open thread/i }).first()).toBeVisible();
});

test('coordinator thread shows existing context and saved reply when present', async ({ page }) => {
  await page.goto('/coordinator/reply/mock-doubt-reply-token');

  await expect(page.getByRole('heading', { name: /reply to message/i })).toBeVisible();
  await expect(page.getByText(/kwame/i)).toBeVisible();
  await expect(page.getByText(/current reply/i)).toBeVisible();
  await expect(page.getByText(/thank you for saying that plainly/i)).toBeVisible();
});
