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
      return { ok: false, step: 'user', error: userData };
    }

    document.cookie = `token=${userData.token}; path=/`;
    return { ok: true };
  }, { email: uniqueEmail, password });

  expect(setupResult.ok).toBeTruthy();
}

async function seedAuthenticatedUserWithContact(page: any) {
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
      return { ok: false, step: 'user', error: userData };
    }

    const contactResponse = await fetch('/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
      }),
    });
    const contactData = await contactResponse.json();
    if (!contactResponse.ok) {
      return { ok: false, step: 'contact', error: contactData };
    }

    document.cookie = `token=${userData.token}; path=/`;
    localStorage.setItem('id', contactData._id);
    return { ok: true };
  }, { email: uniqueEmail, password });

  expect(setupResult.ok).toBeTruthy();
}

test.describe('Navigation and Security', () => {
  test('Unauthenticated access to /contactList renders the contact list page without redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/contactList`);
    await expect(page).toHaveURL(/\/contactList$/);
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Add a New Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Unauthenticated access to /addContact renders the add contact form without redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/addContact`);
    await expect(page).toHaveURL(/\/addContact$/);
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Unauthenticated access to /contactDetails renders the details page without redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/contactDetails`);
    await expect(page).toHaveURL(/\/contactDetails$/);
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Unauthenticated access to /editContact renders the edit form without redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/editContact`);
    await expect(page).toHaveURL(/\/editContact$/);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Primary routes display the correct browser page title', async ({ page }) => {
    // 1. Navigate to the login page and observe the browser tab title
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Contact List App');

    // Seed a user in the browser context so the test focuses on route titles
    await seedAuthenticatedUser(page);

    await page.goto(`${BASE_URL}/contactList`);

    // 2. Observe the title on /contactList
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page).toHaveTitle('My Contacts');

    // 3. Click 'Add a New Contact' and observe the title on /addContact
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page).toHaveTitle('Add Contact');

    // 4. Navigate directly to /addUser and verify the page title there
    await page.goto(`${BASE_URL}/addUser`);
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page).toHaveTitle('Add User');
  });

  test('Contact detail routes currently render an empty browser page title', async ({ page }) => {
    await page.goto(BASE_URL);
    await seedAuthenticatedUserWithContact(page);
    await page.goto(`${BASE_URL}/contactList`);
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // The app currently returns an empty document title for both routes.
    await expect(page.getByRole('row', { name: 'Jane Smith' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await page.getByRole('row', { name: 'Jane Smith' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page).toHaveTitle('');
    await page.getByRole('button', { name: 'Edit Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page).toHaveTitle('');
  });
});
