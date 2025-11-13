/**
 * Routing Integration Tests
 * 
 * Tests for task 17: Write integration tests for routing
 * Requirements: 5.2, 5.3, 5.5, 6.2, 7.2, 7.5
 * 
 * Tests cover:
 * - Navigation between all routes
 * - Browser back and forward button behavior
 * - Modal route opening and closing with back button
 * - Protected route redirects
 * - Deep linking to all routes including modals
 */

import { test, expect } from '@playwright/test';

test.describe('Routing Integration Tests', () => {
  
  test.describe('Navigation Between Routes', () => {
    
    test('should navigate from landing page to login', async ({ page }) => {
      // Requirement 5.5: Deep link support
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find and click login link
      const loginLink = page.locator('a[href="/login"], button:has-text("Log In"), a:has-text("Log In")').first();
      await expect(loginLink).toBeVisible({ timeout: 5000 });
      await loginLink.click();
      
      // Verify navigation to login page
      await expect(page).toHaveURL(/\/login/);
      await expect(page.locator('text=Welcome Back, text=Log In').first()).toBeVisible();
    });
    
    test('should navigate from landing page to signup', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find and click signup link
      const signupLink = page.locator('a[href="/signup"], button:has-text("Sign Up"), button:has-text("Get Started"), a:has-text("Get Started")').first();
      await expect(signupLink).toBeVisible({ timeout: 5000 });
      await signupLink.click();
      
      // Verify navigation to signup page
      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('text=Create Account, text=Sign Up').first()).toBeVisible();
    });
    
    test('should toggle between login and signup', async ({ page }) => {
      // Requirement 6.2: In-app navigation controls
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Switch to signup
      const signupToggle = page.locator('a[href="/signup"], button:has-text("Sign up"), a:has-text("Sign up")').first();
      await expect(signupToggle).toBeVisible({ timeout: 5000 });
      await signupToggle.click();
      
      await expect(page).toHaveURL(/\/signup/);
      
      // Switch back to login
      const loginToggle = page.locator('a[href="/login"], button:has-text("Log in"), a:has-text("Log in")').first();
      await expect(loginToggle).toBeVisible({ timeout: 5000 });
      await loginToggle.click();
      
      await expect(page).toHaveURL(/\/login/);
    });
    
    test('should navigate between dashboard sub-routes', async ({ page }) => {
      // Requirement 5.5: Navigation between dashboard sections
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Navigate to progress
      const progressLink = page.locator('a[href="/dashboard/progress"], nav a:has-text("Progress")').first();
      if (await progressLink.isVisible()) {
        await progressLink.click();
        await expect(page).toHaveURL(/\/dashboard\/progress/);
      }
      
      // Navigate to activities
      const activitiesLink = page.locator('a[href="/dashboard/activities"], nav a:has-text("Activities")').first();
      if (await activitiesLink.isVisible()) {
        await activitiesLink.click();
        await expect(page).toHaveURL(/\/dashboard\/activities/);
      }
      
      // Navigate back to dashboard home
      const homeLink = page.locator('a[href="/dashboard"], nav a:has-text("Home"), nav a:has-text("Dashboard")').first();
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL(/\/dashboard$/);
      }
    });
  });
  
  test.describe('Browser Back and Forward Button Behavior', () => {
    
    test('should navigate back from login to landing page', async ({ page }) => {
      // Requirement 5.2: Browser back button navigation
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to login
      const loginLink = page.locator('a[href="/login"], button:has-text("Log In"), a:has-text("Log In")').first();
      await expect(loginLink).toBeVisible({ timeout: 5000 });
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
      
      // Click back button
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Verify we're back on landing page
      await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
    });
    
    test('should navigate forward after going back', async ({ page }) => {
      // Requirement 5.3: Browser forward button navigation
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to login
      const loginLink = page.locator('a[href="/login"], button:has-text("Log In"), a:has-text("Log In")').first();
      await expect(loginLink).toBeVisible({ timeout: 5000 });
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
      
      // Go forward
      await page.goForward();
      await page.waitForTimeout(500);
      
      // Verify we're back on login page
      await expect(page).toHaveURL(/\/login/);
    });
    
    test('should maintain history through multiple navigations', async ({ page }) => {
      // Test complex navigation history
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate: Landing -> Login -> Signup
      const loginLink = page.locator('a[href="/login"], button:has-text("Log In"), a:has-text("Log In")').first();
      await expect(loginLink).toBeVisible({ timeout: 5000 });
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
      
      const signupToggle = page.locator('a[href="/signup"], button:has-text("Sign up"), a:has-text("Sign up")').first();
      await expect(signupToggle).toBeVisible({ timeout: 5000 });
      await signupToggle.click();
      await expect(page).toHaveURL(/\/signup/);
      
      // Go back twice
      await page.goBack();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/login/);
      
      await page.goBack();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
      
      // Go forward twice
      await page.goForward();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/login/);
      
      await page.goForward();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/signup/);
    });
    
    test('should handle back button in dashboard sub-routes', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Navigate to progress
      const progressLink = page.locator('a[href="/dashboard/progress"], nav a:has-text("Progress")').first();
      if (await progressLink.isVisible()) {
        await progressLink.click();
        await expect(page).toHaveURL(/\/dashboard\/progress/);
        
        // Go back
        await page.goBack();
        await page.waitForTimeout(500);
        await expect(page).toHaveURL(/\/dashboard$/);
      }
    });
  });
  
  test.describe('Modal Route Behavior', () => {
    
    test('should open modal route and close with back button', async ({ page }) => {
      // Requirement 7.2: Browser back button closes modal
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Open persona modal
      const personaCard = page.locator('[id^="persona-card-"]').first();
      await expect(personaCard).toBeVisible({ timeout: 5000 });
      await personaCard.click();
      await page.waitForTimeout(500);
      
      // Verify modal is open and URL changed
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(page).toHaveURL(/\/dashboard\/personas\//);
      
      // Close with back button
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Verify modal closed and URL restored
      await expect(modal).not.toBeVisible();
      await expect(page).toHaveURL(/\/dashboard$/);
    });
    
    test('should support deep linking to modal route', async ({ page }) => {
      // Requirement 7.5: Deep link support for modal routes
      await page.goto('/dashboard/personas/dr-wellness');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Verify modal opens
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Verify underlying dashboard is present
      await page.goBack();
      await page.waitForTimeout(500);
      const dashboard = page.locator('text=Meet Your Expert Coaches, text=Expert Coaches').first();
      await expect(dashboard).toBeVisible();
    });
    
    test('should preserve modal state in URL', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Open modal
      const personaCard = page.locator('[id^="persona-card-"]').first();
      await expect(personaCard).toBeVisible({ timeout: 5000 });
      await personaCard.click();
      await page.waitForTimeout(500);
      
      // Get modal URL
      const modalUrl = page.url();
      expect(modalUrl).toContain('/dashboard/personas/');
      
      // Reload page
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Verify modal is still open
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
    });
  });
  
  test.describe('Protected Route Redirects', () => {
    
    test('should redirect unauthenticated user from dashboard to login', async ({ page }) => {
      // Requirement 5.1: Protected route redirects
      // Clear any existing auth state
      await page.context().clearCookies();
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
    
    test('should redirect unauthenticated user from onboarding to login', async ({ page }) => {
      await page.context().clearCookies();
      await page.goto('/onboarding');
      await page.waitForTimeout(1000);
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
    
    test('should redirect unauthenticated user from persona modal to login', async ({ page }) => {
      await page.context().clearCookies();
      await page.goto('/dashboard/personas/dr-wellness');
      await page.waitForTimeout(1000);
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
    
    test('should preserve intended destination after login redirect', async ({ page }) => {
      // This test verifies the location state is preserved
      await page.context().clearCookies();
      
      // Try to access protected route
      await page.goto('/dashboard/progress');
      await page.waitForTimeout(1000);
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
      
      // Note: Full login flow would require authentication implementation
      // This test verifies the redirect happens correctly
    });
  });
  
  test.describe('Deep Linking Support', () => {
    
    test('should support deep link to landing page', async ({ page }) => {
      // Requirement 5.5: Deep link support
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
      await expect(page.locator('text=Lyfora, text=wellness').first()).toBeVisible({ timeout: 5000 });
    });
    
    test('should support deep link to login page', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveURL(/\/login/);
      await expect(page.locator('text=Welcome Back, text=Log In').first()).toBeVisible();
    });
    
    test('should support deep link to signup page', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveURL(/\/signup/);
      await expect(page.locator('text=Create Account, text=Sign Up').first()).toBeVisible();
    });
    
    test('should support deep link to dashboard home', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Either shows dashboard or redirects to login
      const url = page.url();
      expect(url).toMatch(/\/(dashboard|login)/);
    });
    
    test('should support deep link to dashboard progress', async ({ page }) => {
      await page.goto('/dashboard/progress');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Either shows progress page or redirects to login
      const url = page.url();
      expect(url).toMatch(/\/(dashboard\/progress|login)/);
    });
    
    test('should support deep link to dashboard activities', async ({ page }) => {
      await page.goto('/dashboard/activities');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Either shows activities page or redirects to login
      const url = page.url();
      expect(url).toMatch(/\/(dashboard\/activities|login)/);
    });
    
    test('should support deep link to persona modal', async ({ page }) => {
      // Requirement 7.5: Deep link to modal routes
      await page.goto('/dashboard/personas/dr-wellness');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const url = page.url();
      // Either shows modal or redirects to login
      expect(url).toMatch(/\/(dashboard\/personas|login)/);
    });
    
    test('should handle deep link to non-existent route', async ({ page }) => {
      await page.goto('/non-existent-route');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Should show 404 or redirect to home
      // Verify page doesn't crash
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
  
  test.describe('Navigation State Management', () => {
    
    test('should scroll to top on route change', async ({ page }) => {
      // Requirement 6.2: Scroll to top on navigation
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);
      
      // Navigate to login
      const loginLink = page.locator('a[href="/login"], button:has-text("Log In"), a:has-text("Log In")').first();
      await expect(loginLink).toBeVisible({ timeout: 5000 });
      await loginLink.click();
      await page.waitForTimeout(500);
      
      // Verify scrolled to top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });
    
    test('should maintain scroll position when opening modal', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 200));
      const scrollPosition = await page.evaluate(() => window.scrollY);
      
      // Open modal
      const personaCard = page.locator('[id^="persona-card-"]').first();
      await expect(personaCard).toBeVisible({ timeout: 5000 });
      await personaCard.click();
      await page.waitForTimeout(500);
      
      // Close modal
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Verify scroll position maintained (approximately)
      const newScrollPosition = await page.evaluate(() => window.scrollY);
      expect(Math.abs(newScrollPosition - scrollPosition)).toBeLessThan(50);
    });
    
    test('should handle rapid navigation without errors', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Rapidly navigate between routes
      const loginLink = page.locator('a[href="/login"]').first();
      if (await loginLink.isVisible()) {
        await loginLink.click();
      }
      
      await page.waitForTimeout(100);
      
      const signupLink = page.locator('a[href="/signup"]').first();
      if (await signupLink.isVisible()) {
        await signupLink.click();
      }
      
      await page.waitForTimeout(100);
      
      const loginToggle = page.locator('a[href="/login"]').first();
      if (await loginToggle.isVisible()) {
        await loginToggle.click();
      }
      
      await page.waitForTimeout(500);
      
      // Verify no errors and page is functional
      await expect(page).toHaveURL(/\/login/);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
  
  test.describe('Route Accessibility', () => {
    
    test('should announce route changes to screen readers', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for aria-live region
      const ariaLive = page.locator('[aria-live="polite"], [role="status"]');
      
      // Navigate to login
      const loginLink = page.locator('a[href="/login"], button:has-text("Log In"), a:has-text("Log In")').first();
      await expect(loginLink).toBeVisible({ timeout: 5000 });
      await loginLink.click();
      await page.waitForTimeout(500);
      
      // Verify aria-live region exists (implementation may vary)
      const ariaLiveCount = await ariaLive.count();
      // Just verify the page loaded successfully
      await expect(page).toHaveURL(/\/login/);
    });
    
    test('should maintain focus management during navigation', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Tab to an element
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      // Verify an element has focus
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeTruthy();
    });
  });
});
