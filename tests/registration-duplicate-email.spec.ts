// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('User Registration', () => {
  test('Registration fails when email is already registered', async ({ page }) => {
    // Create a user so we have a known registered email
    const existingEmail = `dup_${randomUUID().split('-')[0]}@example.com`;
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(existingEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Logout' }).click();

    // 1. Navigate to /addUser by clicking 'Sign up' on the login page
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

    // 2. Fill in valid First Name, Last Name, and Password, but enter an email address that has already been registered, then click 'Submit'
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(existingEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Email address is already in use')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();
  });
});
