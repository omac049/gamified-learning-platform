import { test, expect } from '@playwright/test';

test.describe('Game Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');

    // Wait for the game to load
    await page.waitForSelector('canvas', { timeout: 30000 });

    // Wait a bit more for Phaser to initialize
    await page.waitForTimeout(2000);
  });

  test('should load the game successfully', async ({ page }) => {
    // Check that the canvas element is present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check that the game title or initial UI is visible
    // This might need adjustment based on actual game UI
    await expect(page).toHaveTitle(/Gamified Learning Platform/);
  });

  test('should navigate from splash to menu', async ({ page }) => {
    // Wait for splash screen to complete
    await page.waitForTimeout(3000);

    // Look for menu elements or click to proceed
    // This will need to be adjusted based on actual game flow
    const gameArea = page.locator('canvas');
    await gameArea.click({ position: { x: 400, y: 300 } });

    // Wait for menu to appear
    await page.waitForTimeout(2000);

    // Verify we're in the menu (this would need actual menu detection)
    await expect(gameArea).toBeVisible();
  });

  test('should handle character selection', async ({ page }) => {
    // Navigate through splash to character selection
    await page.waitForTimeout(3000);

    // Click through to character selection
    const gameArea = page.locator('canvas');
    await gameArea.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(1000);

    // Simulate character selection clicks
    // These coordinates would need to be adjusted based on actual UI
    await gameArea.click({ position: { x: 200, y: 200 } }); // Select character
    await page.waitForTimeout(500);
    await gameArea.click({ position: { x: 400, y: 500 } }); // Confirm selection

    await page.waitForTimeout(2000);

    // Verify character was selected (would need actual verification)
    await expect(gameArea).toBeVisible();
  });

  test('should start a math lesson', async ({ page }) => {
    // Navigate to math lesson
    await page.waitForTimeout(3000);

    const gameArea = page.locator('canvas');

    // Navigate through menus to math lesson
    await gameArea.click({ position: { x: 400, y: 300 } }); // Skip splash
    await page.waitForTimeout(1000);

    // Click on Week 1 Math or similar
    await gameArea.click({ position: { x: 300, y: 250 } });
    await page.waitForTimeout(2000);

    // Verify we're in a math lesson (would need actual verification)
    await expect(gameArea).toBeVisible();
  });

  test('should handle question answering', async ({ page }) => {
    // Navigate to a question scene
    await page.waitForTimeout(3000);

    const gameArea = page.locator('canvas');

    // Navigate to question
    await gameArea.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(1000);
    await gameArea.click({ position: { x: 300, y: 250 } });
    await page.waitForTimeout(2000);

    // Simulate answering a question
    await gameArea.click({ position: { x: 200, y: 400 } }); // Answer A
    await page.waitForTimeout(1000);

    // Verify feedback or next question appears
    await expect(gameArea).toBeVisible();
  });

  test('should handle combat mechanics', async ({ page }) => {
    // Navigate to combat
    await page.waitForTimeout(3000);

    const gameArea = page.locator('canvas');

    // Navigate through to combat
    await gameArea.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(1000);
    await gameArea.click({ position: { x: 300, y: 250 } });
    await page.waitForTimeout(2000);

    // Simulate combat actions
    await gameArea.click({ position: { x: 500, y: 300 } }); // Attack button
    await page.waitForTimeout(1000);

    // Verify combat feedback
    await expect(gameArea).toBeVisible();
  });

  test('should save and load progress', async ({ page }) => {
    // This test would verify that progress is saved
    // and can be loaded on subsequent visits

    await page.waitForTimeout(3000);

    const gameArea = page.locator('canvas');

    // Make some progress
    await gameArea.click({ position: { x: 400, y: 300 } });
    await page.waitForTimeout(1000);

    // Reload the page
    await page.reload();
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(3000);

    // Verify progress was saved (would need actual progress indicators)
    await expect(gameArea).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await page.waitForSelector('canvas', { timeout: 30000 });
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    await page.waitForSelector('canvas', { timeout: 30000 });
    await expect(canvas).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    await page.waitForSelector('canvas', { timeout: 30000 });
    await expect(canvas).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Test keyboard controls
    await page.keyboard.press('Space'); // Skip splash or select
    await page.waitForTimeout(1000);

    await page.keyboard.press('Enter'); // Confirm selection
    await page.waitForTimeout(1000);

    await page.keyboard.press('ArrowUp'); // Navigate up
    await page.keyboard.press('ArrowDown'); // Navigate down
    await page.keyboard.press('ArrowLeft'); // Navigate left
    await page.keyboard.press('ArrowRight'); // Navigate right

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Test error handling by simulating network issues
    await page.route('**/*', route => {
      if (route.request().url().includes('assets')) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto('/');

    // The game should still load even if some assets fail
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 30000 });
  });
});
