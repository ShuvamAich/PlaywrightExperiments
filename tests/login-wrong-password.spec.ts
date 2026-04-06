// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('User Login', () => {
  test('Login fails with an incorrect password', async ({ page }) => {
    // Register a user to have valid credentials
    const registeredEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(registeredEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Logout' }).click();

    // 1. Navigate to the login page
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();

    // 2. Enter a valid registered email address and an incorrect password, then click 'Submit'
    await page.getByRole('textbox', { name: 'Email' }).fill(registeredEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('WrongPassword!');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Incorrect username or password')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
  });
});
