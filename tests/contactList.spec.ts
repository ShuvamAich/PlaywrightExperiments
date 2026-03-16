import { test, expect, Page } from '@playwright/test';
import { randomUUID } from 'crypto';

const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';
const TEST_EMAIL = `testuser_${randomUUID().split('-')[0]}@example.com`;
const TEST_PASSWORD = 'Password1!';

async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/contactList`);
}

test.describe.serial('Contact List App - Full User Journey', () => {

  test('TC001 - Verify the website opens successfully', async ({ page }) => {
    await page.goto(BASE_URL)

    await expect(page).toHaveTitle('Contact List App');
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('TC002 - Verify a new user can sign up', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/addUser`);
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

    await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
    await page.getByRole('textbox', { name: 'Email' }).fill(TEST_EMAIL);
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/contactList`);
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
  });

  test('TC003 - Verify a user can add a new contact', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Add a New Contact' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/addContact`);
    await expect(page.getByRole('heading', { name: 'Add Contact' })).toBeVisible();

    await page.getByRole('textbox', { name: '* First Name:' }).fill('John');
    await page.getByRole('textbox', { name: '* Last Name:' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('1990-01-15');
    await page.getByRole('textbox', { name: 'Phone:' }).fill('8005551234');
    await page.getByRole('textbox', { name: 'Street Address 1:' }).fill('123 Main St');
    await page.getByRole('textbox', { name: 'City:' }).fill('Springfield');
    await page.getByRole('textbox', { name: 'State or Province:' }).fill('IL');
    await page.getByRole('textbox', { name: 'Postal Code:' }).fill('62701');
    await page.getByRole('textbox', { name: 'Country:' }).fill('USA');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/contactList`);
    await expect(page.getByRole('cell', { name: 'John Doe' })).toBeVisible();
  });

  test('TC004 - Verify a user can edit an existing contact', async ({ page }) => {
    await login(page);

    await page.getByRole('row', { name: /John Doe/ }).click();
    await expect(page).toHaveURL(`${BASE_URL}/contactDetails`);

    await page.getByRole('button', { name: 'Edit Contact' }).click();
    await expect(page).toHaveURL(`${BASE_URL}/editContact`);
    await expect(page.getByRole('heading', { name: 'Edit Contact' })).toBeVisible();

    // Wait for the async fetch that populates form fields to complete
    await page.waitForLoadState('networkidle');

    await page.locator('#phone').fill('9995557777');
    await page.locator('form#edit-contact').evaluate((form: HTMLFormElement) => form.requestSubmit());

    await expect(page).toHaveURL(`${BASE_URL}/contactDetails`);
    await expect(page.getByText('Phone: 9995557777')).toBeVisible();
  });

  test('TC005 - Verify a user can delete a contact', async ({ page }) => {
    await login(page);

    await page.getByRole('row', { name: /John Doe/ }).click();
    await expect(page).toHaveURL(`${BASE_URL}/contactDetails`);

    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Delete Contact' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/contactList`);
    await expect(page.getByRole('cell', { name: 'John Doe' })).not.toBeVisible();
  });

  test('TC006 - Verify a user can log out successfully', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(`${BASE_URL}/`);
    await expect(page.getByRole('heading', { name: 'Contact List App' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  });

});
