// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

async function loginAndNavigateToEditContact(page: any) {
  const uniqueEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.getByRole('button', { name: 'Add a New Contact' }).click();
  await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
  await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
  await page.getByRole('textbox', { name: 'City:' }).fill('Anytown');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('row', { name: 'Jane Smith' }).click();
  await page.getByRole('button', { name: 'Edit Contact' }).click();
}

test.describe('Edit Contact', () => {
  test('Edit Contact form displays pre-populated values', async ({ page }) => {
    // 1. Log in and navigate to a contact's detail page, then click 'Edit Contact'
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'First Name:' })).toHaveValue('Jane');
    await expect(page.getByRole('textbox', { name: 'Last Name:' })).toHaveValue('Smith');
    await expect(page.getByRole('textbox', { name: 'City:' })).toHaveValue('Anytown');
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('Successfully updating a contact fields saves the new values', async ({ page }) => {
    // 1. Log in and navigate to the Edit Contact form for an existing contact
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible();

    // 2. Change the First Name field to 'UpdatedName' and City to 'UpdatedCity', then click 'Submit'
    await page.getByRole('textbox', { name: 'First Name:' }).fill('UpdatedName');
    await page.getByRole('textbox', { name: 'City:' }).fill('UpdatedCity');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await expect(page.getByText('First Name: UpdatedName')).toBeVisible();
    await expect(page.getByText('City: UpdatedCity')).toBeVisible();
    await expect(page.getByText('Last Name: Smith')).toBeVisible();
  });

  test('Edit contact fails when required name fields are cleared', async ({ page }) => {
    // 1. Log in and navigate to the Edit Contact form for an existing contact
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible();

    // 2. Clear both the First Name and Last Name fields, then click 'Submit'
    await page.getByRole('textbox', { name: 'First Name:' }).fill('');
    await page.getByRole('textbox', { name: 'Last Name:' }).fill('');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Validation failed: lastName: Path `lastName` is required., firstName: Path `firstName` is required.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible();
  });

  test('Cancelling an edit discards changes and returns to Contact Details', async ({ page }) => {
    // 1. Log in and navigate to the Edit Contact form, noting the original First Name value
    await loginAndNavigateToEditContact(page);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible();

    // 2. Change the First Name to a different value, then click 'Cancel' without submitting
    await page.getByRole('textbox', { name: 'First Name:' }).fill('ChangedName');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await expect(page.getByText('First Name: Jane')).toBeVisible();
  });
});
