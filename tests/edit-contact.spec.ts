// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const WAIT_TIMEOUT = 30000;

async function loginAndNavigateToEditContact(page: any) {
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
        city: 'Anytown',
      }),
    });
    const contactData = await contactResponse.json();
    if (!contactResponse.ok) {
      return { ok: false, step: 'contact', error: contactData };
    }

    document.cookie = `token=${userData.token}; path=/`;
    localStorage.setItem('id', contactData._id);

    return { ok: true, contactId: contactData._id };
  }, { email: uniqueEmail });
  expect(setupResult.ok).toBeTruthy();

  await page.goto(`${BASE_URL}/contactDetails`);
  await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  await page.getByRole('button', { name: 'Edit Contact' }).click();
  await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  await expect(page.getByRole('textbox', { name: 'First Name:' })).toHaveValue('Jane', { timeout: WAIT_TIMEOUT });
  await expect(page.getByRole('textbox', { name: 'Last Name:' })).toHaveValue('Smith', { timeout: WAIT_TIMEOUT });
  await expect(page.getByRole('textbox', { name: 'City:' })).toHaveValue('Anytown', { timeout: WAIT_TIMEOUT });
}

async function replaceTextboxValue(page: any, label: string, value: string) {
  const field = page.getByRole('textbox', { name: label });
  await field.click();
  await page.keyboard.press('Control+A');
  if (value.length > 0) {
    await page.keyboard.type(value);
    return;
  }
  await page.keyboard.press('Backspace');
}

test.describe('Edit Contact', () => {
  test('Edit Contact form displays pre-populated values', async ({ page }) => {
    // 1. Log in and navigate to a contact's detail page, then click 'Edit Contact'
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('textbox', { name: 'First Name:' })).toHaveValue('Jane');
    await expect(page.getByRole('textbox', { name: 'Last Name:' })).toHaveValue('Smith');
    await expect(page.getByRole('textbox', { name: 'City:' })).toHaveValue('Anytown');
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('Successfully updating a contact fields saves the new values', async ({ page }) => {
    // 1. Log in and navigate to the Edit Contact form for an existing contact
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Change the First Name field to 'UpdatedName' and City to 'UpdatedCity', then click 'Submit'
    await replaceTextboxValue(page, 'First Name:', 'UpdatedName');
    await replaceTextboxValue(page, 'City:', 'UpdatedCity');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('First Name: UpdatedName')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('City: UpdatedCity')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Last Name: Smith')).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Edit contact fails when required name fields are cleared', async ({ page }) => {
    // 1. Log in and navigate to the Edit Contact form for an existing contact
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Clear both the First Name and Last Name fields, then click 'Submit'
    await replaceTextboxValue(page, 'First Name:', '');
    await replaceTextboxValue(page, 'Last Name:', '');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Validation failed: lastName: Path `lastName` is required., firstName: Path `firstName` is required.')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test('Cancelling an edit discards changes and returns to Contact Details', async ({ page }) => {
    // 1. Log in and navigate to the Edit Contact form, noting the original First Name value
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });

    // 2. Change the First Name to a different value, then click 'Cancel' without submitting
    await replaceTextboxValue(page, 'First Name:', 'ChangedName');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('First Name: Jane')).toBeVisible({ timeout: WAIT_TIMEOUT });
  });
});
