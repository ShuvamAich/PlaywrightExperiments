import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const TEST_EMAIL = `testuser_${randomUUID().split('-')[0]}@example.com`;
const TEST_PASSWORD = 'Password1!';

test.describe('Create User', () => {
  test('seed', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Submit' }).click();
  });
});
