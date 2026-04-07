// spec: specs/contact-list-test-plan.md 
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const WAIT_TIMEOUT = 30000;

test.describe('User Login', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    // Create a test user first using the app API in the browser context
    const uniqueEmail = `logintest_${Date.now()}@example.com`;
    const testPassword = 'Password1!';

    await page.goto(BASE_URL);
    const setupResult = await page.evaluate(async ({ email, password }) => {
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Login',
          lastName: 'Test',
          email,
          password,
        }),
      });

      const data = await response.json();
      return {
        ok: response.ok,
        data,
      };
    }, { email: uniqueEmail, password: testPassword });
    expect(setupResult.ok).toBeTruthy();

    // 1. Navigate to https://thinking-tester-contact-list.herokuapp.com
    await page.goto(BASE_URL);
    await expect(page.getByText('Log In:')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Fill in the Email field with a valid registered email address and the Password field with the corresponding password
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);

    // 3. Click 'Submit'
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page).toHaveTitle('My Contacts');
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Add a New Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });
});