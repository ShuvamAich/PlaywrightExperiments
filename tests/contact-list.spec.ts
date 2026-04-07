// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const WAIT_TIMEOUT = 30000;

async function seedAuthenticatedUser(page: any) {
  const uniqueEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
  const password = 'Password1!';
  const setupResult = await page.evaluate(async ({ email, password: pwd }: { email: string; password: string }) => {
    const userResponse = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email,
        password: pwd,
      }),
    });
    const userData = await userResponse.json();
    if (!userResponse.ok) {
      return { ok: false, error: userData };
    }

    document.cookie = `token=${userData.token}; path=/`;
    return { ok: true };
  }, { email: uniqueEmail, password });

  expect(setupResult.ok).toBeTruthy();
}

test.describe('Contact List', () => {
  test('Contact list table is empty for a new user account', async ({ page }) => {
    // 1. Seed a fresh account and open the contact list
    await page.goto(BASE_URL);
    await seedAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/contactList`);

    // 2. Observe the contact table
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('row', { name: /.*/ }).nth(1)).not.toBeAttached();
  });

  test('Clicking a contact row navigates to the Contact Details page', async ({ page }) => {
    // 1. Log in with an account that has at least one contact
    await page.goto(BASE_URL);
    await seedAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/contactList`);
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('row', { name: 'Jane Smith' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Click on the contact row
    await page.getByRole('row', { name: 'Jane Smith' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await expect(page.getByText('First Name: Jane')).toBeVisible();
    await expect(page.getByText('Last Name: Smith')).toBeVisible();
  });

  test('Newly added contact appears in the contact list', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact', fill all fields, then click Submit
    await page.goto(BASE_URL);
    await seedAuthenticatedUser(page);
    await page.goto(`${BASE_URL}/contactList`);
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('1990-01-15');
    await page.getByRole('textbox', { name: 'Email:' }).fill('jane.smith@example.com');
    await page.getByRole('textbox', { name: 'Phone:' }).fill('8005553535');
    await page.getByRole('textbox', { name: 'Street Address 1:' }).fill('123 Main St');
    await page.getByRole('textbox', { name: 'Country:' }).fill('USA');
    await page.getByRole('button', { name: 'Submit' }).click();

    // 2. Observe the contact table
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Jane Smith')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('1990-01-15')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('jane.smith@example.com')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('8005553535')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('USA')).toBeVisible({ timeout: WAIT_TIMEOUT });
  });
});
