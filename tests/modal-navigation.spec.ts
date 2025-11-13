/**
 * Modal Navigation Behavior Tests
 * 
 * Tests for task 10.2: Implement modal navigation behavior
 * Requirements: 7.2, 7.4, 7.5
 */

import { test, expect } from '@playwright/test';

test.describe('Modal Navigation Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard (assuming user is logged in or we're in dev mode)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should close persona chat modal with browser back button', async ({ page }) => {
    // Requirement 7.2: Browser back button closes modal
    
    // Find and click a persona card to open the modal
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    
    // Store the card for later focus verification
    const cardId = await personaCard.getAttribute('id');
    
    await personaCard.click();
    await page.waitForTimeout(500);
    
    // Verify modal is open by checking for dialog role
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // Click browser back button
    await page.goBack();
    await page.waitForTimeout(500);
    
    // Verify modal is closed
    await expect(modal).not.toBeVisible();
    
    // Verify we're back on the dashboard
    const dashboard = page.locator('text=Meet Your Expert Coaches, text=Expert Coaches').first();
    await expect(dashboard).toBeVisible();
  });

  test('should support deep linking to persona chat modal', async ({ page }) => {
    // Requirement 7.5: Support deep linking to modal routes
    
    // Navigate directly to a persona chat URL
    await page.goto('/dashboard/personas/dr-wellness');
    await page.waitForTimeout(1000);
    
    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Verify the persona name is displayed in the modal
    const personaName = page.locator('text=Dr. Wellness');
    await expect(personaName).toBeVisible();
    
    // Verify the underlying dashboard is still present
    await page.goBack();
    await page.waitForTimeout(500);
    const dashboard = page.locator('text=Meet Your Expert Coaches, text=Expert Coaches').first();
    await expect(dashboard).toBeVisible();
  });

  test('should restore focus to persona card on modal close', async ({ page }) => {
    // Requirement 7.4: Restore focus to triggering element on modal close
    
    // Find the first persona card
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    
    const cardId = await personaCard.getAttribute('id');
    
    // Click the card to open modal
    await personaCard.click();
    await page.waitForTimeout(500);
    
    // Verify modal is open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Close modal with back button
    await page.goBack();
    await page.waitForTimeout(500);
    
    // Verify focus is restored to the persona card
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.id;
    });
    
    expect(focusedElement).toBe(cardId);
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Additional test: Escape key should also close modal
    
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    
    await personaCard.click();
    await page.waitForTimeout(500);
    
    // Verify modal is open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Press Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should close modal with close button', async ({ page }) => {
    // Additional test: Close button should work
    
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    
    await personaCard.click();
    await page.waitForTimeout(500);
    
    // Verify modal is open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Find and click close button
    const closeButton = page.locator('button[aria-label*="Close"], button:has-text("×")').first();
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await page.waitForTimeout(500);
    
    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should preserve underlying page state when modal opens', async ({ page }) => {
    // Requirement 7.3: Preserve underlying page state
    
    // Scroll the page to a specific position
    await page.evaluate(() => window.scrollTo(0, 200));
    const scrollPosition = await page.evaluate(() => window.scrollY);
    
    // Open modal
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    await personaCard.click();
    await page.waitForTimeout(500);
    
    // Verify modal is open
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Close modal
    await page.goBack();
    await page.waitForTimeout(500);
    
    // Verify scroll position is preserved (approximately)
    const newScrollPosition = await page.evaluate(() => window.scrollY);
    expect(Math.abs(newScrollPosition - scrollPosition)).toBeLessThan(50);
  });

  test('should handle multiple modal open/close cycles', async ({ page }) => {
    // Test that modal can be opened and closed multiple times
    
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    
    // Open and close modal 3 times
    for (let i = 0; i < 3; i++) {
      // Open modal
      await personaCard.click();
      await page.waitForTimeout(500);
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // Close modal
      await page.goBack();
      await page.waitForTimeout(500);
      
      await expect(modal).not.toBeVisible();
    }
  });

  test('should handle keyboard navigation to open modal', async ({ page }) => {
    // Test opening modal with keyboard (Enter key)
    
    // Tab to the first persona card
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    // Keep tabbing until we reach a persona card
    for (let i = 0; i < 20; i++) {
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.id;
      });
      
      if (focusedElement && focusedElement.startsWith('persona-card-')) {
        // Found a persona card, press Enter
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        
        // Verify modal opened
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();
        
        // Close and verify focus restoration
        await page.goBack();
        await page.waitForTimeout(500);
        
        const restoredFocus = await page.evaluate(() => {
          return document.activeElement?.id;
        });
        
        expect(restoredFocus).toBe(focusedElement);
        break;
      }
      
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
  });

  test('should handle deep link with invalid persona ID', async ({ page }) => {
    // Test error handling for invalid persona ID
    
    await page.goto('/dashboard/personas/invalid-persona-id');
    await page.waitForTimeout(1000);
    
    // Should show error message in modal
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    const errorMessage = page.locator('text=Persona Not Found, text=could not be found').first();
    await expect(errorMessage).toBeVisible();
  });

  test('should maintain URL state during modal navigation', async ({ page }) => {
    // Verify URL changes when modal opens and closes
    
    const personaCard = page.locator('[id^="persona-card-"]').first();
    await expect(personaCard).toBeVisible({ timeout: 5000 });
    
    // Get initial URL
    const initialUrl = page.url();
    expect(initialUrl).toContain('/dashboard');
    
    // Open modal
    await personaCard.click();
    await page.waitForTimeout(500);
    
    // Verify URL changed to modal route
    const modalUrl = page.url();
    expect(modalUrl).toContain('/dashboard/personas/');
    expect(modalUrl).not.toBe(initialUrl);
    
    // Close modal
    await page.goBack();
    await page.waitForTimeout(500);
    
    // Verify URL is back to initial
    const finalUrl = page.url();
    expect(finalUrl).toBe(initialUrl);
  });
});
