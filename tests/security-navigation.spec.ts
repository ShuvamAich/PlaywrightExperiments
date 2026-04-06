// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, Browser } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('Navigation and Security', () => {
  // Each security test uses a fresh browser context (no saved auth state)
  test('Unauthenticated access to /contactList is blocked', async ({ browser }) => {
    // 1. Without logging in, navigate directly to /contactList
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/contactList`);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact List' })).not.toBeVisible();
    await context.close();
  });

  test('Unauthenticated access to /addContact is blocked', async ({ browser }) => {
    // 1. Without logging in, navigate directly to /addContact
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/addContact`);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).not.toBeVisible();
    await context.close();
  });

  test('Unauthenticated access to /contactDetails is blocked', async ({ browser }) => {
    // 1. Without logging in, navigate directly to /contactDetails
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/contactDetails`);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).not.toBeVisible();
    await context.close();
  });

  test('Unauthenticated access to /editContact is blocked', async ({ browser }) => {
    // 1. Without logging in, navigate directly to /editContact
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/editContact`);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).not.toBeVisible();
    await context.close();
  });

  test('Each route displays the correct browser page title', async ({ page }) => {
    // 1. Navigate to the login page and observe the browser tab title
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Contact List App');

    // Register and log in
    const uniqueEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();

    // 2. Observe the title on /contactList
    await expect(page).toHaveTitle('My Contacts');

    // 3. Click 'Add a New Contact' and observe the title on /addContact
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page).toHaveTitle('Add Contact');

    // Add a contact so we can navigate to details
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('button', { name: 'Submit' }).click();

    // 4. Click a contact row and observe the title on /contactDetails
    await page.getByRole('row', { name: 'Jane Smith' }).click();
    await expect(page).toHaveTitle('Contact Details');

    // 5. Click 'Edit Contact' and observe the title on /editContact
    await page.getByRole('button', { name: 'Edit Contact' }).click();
    await expect(page).toHaveTitle('Edit Contact');

    // 6. Navigate back to login and click 'Sign up' for /addUser title
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveTitle('Add User');
  });
});
