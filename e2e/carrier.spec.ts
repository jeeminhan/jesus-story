import { expect, test } from '@playwright/test';

test('carrier can navigate to share page', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');
  await expect(page.getByRole('heading', { name: /make something for one person/i })).toBeVisible();
});

test('share page centers a recipient before the scene selector', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');

  await expect(page.getByLabel(/who is this for/i)).toBeVisible();
  await expect(page.getByLabel(/what are they carrying right now/i)).toBeVisible();
  await expect(page.locator('[aria-pressed="true"]').first()).toBeVisible();
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

test('share preview renders personalized framing', async ({ page }) => {
  await page.goto('/en/the-king-who-came/share');

  await page.getByLabel(/your name/i).fill('Maya');
  await page.getByLabel(/who is this for/i).fill('Priya');
  await page
    .getByLabel(/what are they carrying right now/i)
    .fill('She is adjusting to life in a new country and carrying quiet questions.');

  await expect(page.getByText(/for Priya/i)).toBeVisible();
  await expect(page.getByText(/from Maya/i)).toBeVisible();
  await expect(page.getByTestId('share-preview-bridge')).toContainText('Priya came to mind');
});

test('scene-specific bridge card still opens on the art-card surface first', async ({ page }) => {
  await page.goto(
    '/en/the-king-who-came?scene=scene-searching-6&card=1&sender=Maya&recipient=Priya&burden=She%20is%20carrying%20quiet%20questions.',
  );

  await expect(page.getByRole('main', { name: /story entry/i })).toBeVisible();
  await expect(page.getByText(/for Priya/i)).toBeVisible();
  await expect(page.getByText(/from Maya/i)).toBeVisible();
  await page.getByRole('button', { name: /tap anywhere to begin/i }).click();
  await expect(page.getByRole('heading', { name: 'The Rescue' })).toBeVisible();
});
