// spec: specs/contact-list-test-plan.md 
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Contact', () => {
  test.beforeEach(async ({ page }) => {
    // Set up a logged-in user
    await page.goto('https://thinking-tester-contact-list.herokuapp.com');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('Password1!');
    await page.getByRole('button', { name: 'Submit' }).click();
  });

  test('Successfully add a contact with all fields filled', async ({ page }) => {
    // 1. Log in and click 'Add a New Contact'
    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* First Name:' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

    // 2. Fill in all fields: First Name 'Jane', Last Name 'Smith', Date of Birth '1990-01-15', Email 'jane.smith@example.com', Phone '8005553535', Street Address 1 '123 Main St', Street Address 2 'Apt 4B', City 'Anytown', State or Province 'CA', Postal Code '12345', Country 'USA'
    await page.getByRole('textbox', { name: '* First Name:' }).fill('Jane');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Smith');
    await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('1990-01-15');
    await page.getByRole('textbox', { name: 'Email:' }).fill('jane.smith@example.com');
    await page.getByRole('textbox', { name: 'Phone:' }).fill('8005553535');
    await page.getByRole('textbox', { name: 'Street Address 1:' }).fill('123 Main St');
    await page.getByRole('textbox', { name: 'Street Address 2:' }).fill('Apt 4B');
    await page.getByRole('textbox', { name: 'City:' }).fill('Anytown');
    await page.getByRole('textbox', { name: 'State or Province:' }).fill('CA');
    await page.getByRole('textbox', { name: 'Postal Code:' }).fill('12345');
    await page.getByRole('textbox', { name: 'Country:' }).fill('USA');

    // 3. Click 'Submit'
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('1990-01-15')).toBeVisible();
    await expect(page.getByText('jane.smith@example.com')).toBeVisible();
    await expect(page.getByText('8005553535')).toBeVisible();
  });
});