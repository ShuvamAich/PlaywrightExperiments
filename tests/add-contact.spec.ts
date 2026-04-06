// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('Add Contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(`testuser_${randomUUID().split('-')[0]}@example.com`);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();
  });

  test('Successfully add a contact with only the required fields', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact'
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();

    // 2. Fill in only First Name and Last Name, leave all other fields blank, then click 'Submit'
    await page.getByRole('textbox', { name: '* First Name:' }).fill('John');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Doe');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('Add contact fails when First Name and Last Name are missing', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact'
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();

    // 2. Leave First Name and Last Name blank, fill in optional fields, and click 'Submit'
    await page.getByRole('textbox', { name: 'Email:' }).fill('test@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Contact validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();
  });

  test('Add contact fails with an invalid Date of Birth format', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact'
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();

    // 2. Fill required fields and enter an invalid Date of Birth, then click 'Submit'
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('15/01/1990');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Contact validation failed: birthdate: Birthdate is invalid')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();
  });

  test('Cancelling the Add Contact form returns to the Contact List without saving', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact'
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();

    // 2. Fill in several fields including First Name and Last Name, then click 'Cancel'
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByText('Jane Smith')).not.toBeVisible();
  });
});
