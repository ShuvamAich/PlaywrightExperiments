// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const WAIT_TIMEOUT = 30000;

async function loginAndNavigateToContactDetails(page: any) {
  const uniqueEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
  await page.goto(BASE_URL);
  const setupResult = await page.evaluate(async ({ email }) => {
    const userResponse = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email,
        password: 'Password1!',
      }),
    });
    const userData = await userResponse.json();
    if (!userResponse.ok) {
      return {
        ok: false,
        step: 'user',
        error: userData,
      };
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
      return {
        ok: false,
        step: 'contact',
        error: contactData,
      };
    }

    document.cookie = `token=${userData.token}; path=/`;
    localStorage.setItem('id', contactData._id);

    return {
      ok: true,
      contactId: contactData._id,
    };
  }, { email: uniqueEmail });
  expect(setupResult.ok).toBeTruthy();

  await page.goto(`${BASE_URL}/contactDetails`);
  await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
}

test.describe('Delete Contact', () => {
  test('Successfully deleting a contact removes it from the list', async ({ page }) => {
    // 1. Log in and ensure at least one contact exists. Navigate to that contact's detail page
    await loginAndNavigateToContactDetails(page);
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Delete Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Note the contact's name, then click 'Delete Contact'
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Delete Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Jane Smith')).not.toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Deleting all contacts leaves the list empty', async ({ page }) => {
    // 1. Log in with an account that has exactly one contact and navigate to that contact's detail page
    await loginAndNavigateToContactDetails(page);
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Click 'Delete Contact'
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Delete Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('row', { name: 'Jane Smith' })).not.toBeAttached({ timeout: WAIT_TIMEOUT });
  });
});
