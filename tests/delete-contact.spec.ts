// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

async function loginAndNavigateToContactDetails(page: any) {
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
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('row', { name: 'Jane Smith' }).click();
}

test.describe('Delete Contact', () => {
  test('Successfully deleting a contact removes it from the list', async ({ page }) => {
    // 1. Log in and ensure at least one contact exists. Navigate to that contact's detail page
    await loginAndNavigateToContactDetails(page);
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Contact' })).toBeVisible();

    // 2. Note the contact's name, then click 'Delete Contact'
    await page.getByRole('button', { name: 'Delete Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });

  test('Deleting all contacts leaves the list empty', async ({ page }) => {
    // 1. Log in with an account that has exactly one contact and navigate to that contact's detail page
    await loginAndNavigateToContactDetails(page);
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();

    // 2. Click 'Delete Contact'
    await page.getByRole('button', { name: 'Delete Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'Jane Smith' })).not.toBeAttached();
  });
});
