// spec: specs/contact-list-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

test.describe('Contact List', () => {
  test('Contact list table is empty for a new user account', async ({ page }) => {
    // 1. Register a fresh account and log in
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(`testuser_${randomUUID().split('-')[0]}@example.com`);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();

    // 2. Observe the contact table
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('row', { name: /.*/ }).nth(1)).not.toBeAttached();
  });

  test('Clicking a contact row navigates to the Contact Details page', async ({ page }) => {
    // 1. Log in with an account that has at least one contact
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(`testuser_${randomUUID().split('-')[0]}@example.com`);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('row', { name: 'Jane Smith' })).toBeVisible();

    // 2. Click on the contact row
    await page.getByRole('row', { name: 'Jane Smith' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await expect(page.getByText('First Name: Jane')).toBeVisible();
    await expect(page.getByText('Last Name: Smith')).toBeVisible();
  });

  test('Newly added contact appears in the contact list', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact', fill all fields, then click Submit
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(`testuser_${randomUUID().split('-')[0]}@example.com`);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('1990-01-15');
    await page.getByRole('textbox', { name: 'Email:' }).fill('jane.smith@example.com');
    await page.getByRole('textbox', { name: 'Phone:' }).fill('8005553535');
    await page.getByRole('textbox', { name: 'Street Address 1:' }).fill('123 Main St');
    await page.getByRole('textbox', { name: 'Country:' }).fill('USA');
    await page.getByRole('button', { name: 'Submit' }).click();

    // 2. Observe the contact table
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('1990-01-15')).toBeVisible();
    await expect(page.getByText('jane.smith@example.com')).toBeVisible();
    await expect(page.getByText('8005553535')).toBeVisible();
    await expect(page.getByText('USA')).toBeVisible();
  });
});
