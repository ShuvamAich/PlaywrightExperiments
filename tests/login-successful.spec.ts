// spec: specs/contact-list-test-plan.md 
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    // Create a test user first by registering
    const uniqueEmail = `logintest_${Date.now()}@example.com`;
    const testPassword = 'Password1!';
    
    await page.goto('https://thinking-tester-contact-list.herokuapp.com');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Login');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Logout to test login flow
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // 1. Navigate to https://thinking-tester-contact-list.herokuapp.com
    await expect(page.getByText('Log In:')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

    // 2. Fill in the Email field with a valid registered email address and the Password field with the corresponding password
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);

    // 3. Click 'Submit'
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page).toHaveTitle('My Contacts');
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add a New Contact' })).toBeVisible();
  });
});