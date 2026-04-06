// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

async function loginAndAddContact(page: any, uniqueEmail: string) {
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
}

test.describe('Contact Details', () => {
  test('Contact details page displays all saved field values', async ({ page }) => {
    // 1. Log in, add a contact with all fields filled, and click that contact's row in the list
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
    await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('1990-01-15');
    await page.getByRole('textbox', { name: 'Email:' }).fill('jane.smith@example.com');
    await page.getByRole('textbox', { name: 'Phone:' }).fill('8005553535');
    await page.getByRole('textbox', { name: 'Street Address 1:' }).fill('123 Main St');
    await page.getByRole('textbox', { name: 'City:' }).fill('Anytown');
    await page.getByRole('textbox', { name: 'State or Province:' }).fill('CA');
    await page.getByRole('textbox', { name: 'Postal Code:' }).fill('12345');
    await page.getByRole('textbox', { name: 'Country:' }).fill('USA');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('row', { name: 'Jane Smith' }).click();

    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();

    // 2. Observe all displayed information
    await expect(page.getByText('First Name: Jane')).toBeVisible();
    await expect(page.getByText('Last Name: Smith')).toBeVisible();
    await expect(page.getByText('Date of Birth: 1990-01-15')).toBeVisible();
    await expect(page.getByText('Email: jane.smith@example.com')).toBeVisible();
    await expect(page.getByText('Phone: 8005553535')).toBeVisible();
    await expect(page.getByText('Street Address 1: 123 Main St')).toBeVisible();
    await expect(page.getByText('City: Anytown')).toBeVisible();
    await expect(page.getByText('State or Province: CA')).toBeVisible();
    await expect(page.getByText('Postal Code: 12345')).toBeVisible();
    await expect(page.getByText('Country: USA')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit Contact' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Contact' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return to Contact List' })).toBeVisible();
  });

  test("'Return to Contact List' navigates back to /contactList", async ({ page }) => {
    // 1. Log in and navigate to a contact's detail page
    const uniqueEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
    await loginAndAddContact(page, uniqueEmail);
    await page.getByRole('row', { name: 'Jane Smith' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();

    // 2. Click 'Return to Contact List'
    await page.getByRole('button', { name: 'Return to Contact List' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add a New Contact' })).toBeVisible();
  });
});
