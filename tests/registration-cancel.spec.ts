// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('User Registration', () => {
  test('Clicking Cancel on the registration form returns to the login page', async ({ page }) => {
    // 1. Navigate to /addUser by clicking 'Sign up' on the login page
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

    // 2. Fill in some fields (do not submit) then click 'Cancel'
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  });
});
