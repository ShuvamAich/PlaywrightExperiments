// spec: specs/contact-list-test-plan.md 
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const WAIT_TIMEOUT = 30000;

test.describe('User Registration', () => {
  test('Successful registration with valid details', async ({ page }) => {
    // 1. Navigate to https://thinking-tester-contact-list.herokuapp.com
    await page.goto(BASE_URL);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Click the 'Sign up' button
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForLoadState('load');
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 3. Fill in 'First Name' with 'Test', 'Last Name' with 'User', 'Email' with a unique valid email address, and 'Password' with 'Password1!'
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');

    // 4. Click 'Submit'
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Add a New Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });
});