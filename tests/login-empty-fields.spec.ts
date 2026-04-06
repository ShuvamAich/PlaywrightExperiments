// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('User Login', () => {
  test('Login fails when both fields are left empty', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto(BASE_URL);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();

    // 2. Leave the Email and Password fields empty and click 'Submit'
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Incorrect username or password')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
  });
});
