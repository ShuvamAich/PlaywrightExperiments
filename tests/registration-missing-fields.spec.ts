// spec: specs/contact-list-test-plan.md 
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const WAIT_TIMEOUT = 30000;

test.describe('User Registration', () => {
  test('Registration fails when all required fields are left blank', async ({ page }) => {
    // 1. Navigate to https://thinking-tester-contact-list.herokuapp.com and click 'Sign up'
    await page.goto('https://thinking-tester-contact-list.herokuapp.com');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Leave all fields blank and click 'Submit'
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('User validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required., email: Email is invalid, password: Path `password` is required.')).toBeVisible({ timeout: WAIT_TIMEOUT });
    
    // Verify user is not redirected away from /addUser
    await expect(page).toHaveURL(/\/addUser$/, { timeout: WAIT_TIMEOUT });
  });
});