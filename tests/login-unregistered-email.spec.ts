// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('User Login', () => {
  test('Login fails with an unregistered email address', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto(BASE_URL);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();

    // 2. Enter an email address that has not been registered along with any password, then click 'Submit'
    await page.getByRole('textbox', { name: 'Email' }).fill('notregistered_99999@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Incorrect username or password')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
  });
});
