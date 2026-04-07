// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const WAIT_TIMEOUT = 30000;

async function seedAuthenticatedContact(page: any, contactData: Record<string, string>) {
  const uniqueEmail = `testuser_${randomUUID().split('-')[0]}@example.com`;
  await page.goto(BASE_URL);
  const setupResult = await page.evaluate(
    async ({ email, contact }: { email: string; contact: Record<string, string> }) => {
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
        body: JSON.stringify(contact),
      });
      const createdContact = await contactResponse.json();
      if (!contactResponse.ok) {
        return { ok: false, step: 'contact', error: createdContact };
      }

      document.cookie = `token=${userData.token}; path=/`;
      localStorage.setItem('id', createdContact._id);
      return { ok: true };
    },
    { email: uniqueEmail, contact: contactData },
  );

  expect(setupResult.ok).toBeTruthy();
}

async function openContactDetails(page: any, contactData: Record<string, string>) {
  await seedAuthenticatedContact(page, contactData);
  await page.goto(`${BASE_URL}/contactDetails`);
  await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible({ timeout: WAIT_TIMEOUT });
}

test.describe('Contact Details', () => {
  test('Contact details page displays all saved field values', async ({ page }) => {
    // 1. Log in, add a contact with all fields filled, and click that contact's row in the list
    await openContactDetails(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      birthdate: '1990-01-15',
      email: 'jane.smith@example.com',
      phone: '8005553535',
      street1: '123 Main St',
      city: 'Anytown',
      stateProvince: 'CA',
      postalCode: '12345',
      country: 'USA',
    });

    // 2. Observe all displayed information
    await expect(page.getByText('First Name: Jane')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Last Name: Smith')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Date of Birth: 1990-01-15')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Email: jane.smith@example.com')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Phone: 8005553535')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Street Address 1: 123 Main St')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('City: Anytown')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('State or Province: CA')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Postal Code: 12345')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByText('Country: USA')).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Edit Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Delete Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Return to Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });

  test("'Return to Contact List' navigates back to /contactList", async ({ page }) => {
    // 1. Log in and navigate to a contact's detail page
    await openContactDetails(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'Anytown',
    });

    // 2. Click 'Return to Contact List'
    await page.getByRole('button', { name: 'Return to Contact List' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible({ timeout: WAIT_TIMEOUT });
    await expect(page.getByRole('button', { name: 'Add a New Contact' })).toBeVisible({ timeout: WAIT_TIMEOUT });
  });
});
