import { test, expect } from '@playwright/test';
import * as OTPAuth from "otpauth";

test('login with multifactor authentication', async ({ page }) => {
    
    //locators
    let loginButtonHomePage = page.getByRole('button', { name: 'Login' });
    let cookieAcceptButton = page.getByRole('button', { name: 'Accept All Cookies' });
    let emailInput = page.getByPlaceholder('Email address');
    let passwordInput = page.getByPlaceholder('Password');
    let loginButtonLoginPage = page.getByRole('button', { name: 'Log In' });
    let otpInput = page.locator('#input-9');
    let verifyButton = page.getByRole('button', { name: 'Verify' });

    let totp = new OTPAuth.TOTP({
    issuer: "ACME",
    label: "MyTOTP",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: process.env.HEROKU_OTP_SECRET!
    });
  
    await page.goto('https://www.heroku.com/');
    await cookieAcceptButton.click();
    await loginButtonHomePage.click();
    
    await expect(page).toHaveURL('https://id.heroku.com/login');

    await emailInput.fill(process.env.HEROKU_EMAIL!);
    await passwordInput.fill(process.env.HEROKU_PASSWORD!);
    await loginButtonLoginPage.click();
    await expect(page).toHaveURL('https://verify.salesforce.com/v1/verify/');
    let token = totp.generate();
    await otpInput.fill(token);
    await verifyButton.click();
    await expect(page).toHaveURL('https://dashboard.heroku.com/');
  
});

