# Automate Heroku MFA with Playwright

This project automates a Heroku login flow protected by multi-factor authentication using Playwright.

The main test opens the Heroku website, navigates to the login page, signs in with account credentials, generates a time-based one-time password from a shared MFA secret, submits the verification code, and confirms that the user reaches the Heroku dashboard.

## What This Project Covers

The current MFA login test performs these steps:

1. Opens https://www.heroku.com/
2. Accepts the cookie banner
3. Clicks the Login button
4. Waits for the Heroku identity login page
5. Enters the Heroku email and password
6. Submits the login form
7. Waits for the Salesforce verification page
8. Generates a fresh TOTP code with the otpauth package
9. Enters the MFA code and verifies login success
10. Confirms navigation to the Heroku dashboard

This means the project is testing a real browser-based authentication flow, not a mocked login.

## Tech Stack

- Playwright Test
- TypeScript
- OTPAuth for TOTP generation
- Node.js and npm

## Project Structure

- tests/otp.spec.ts: Heroku MFA login test
- tests/example.spec.ts: sample Playwright test
- playwright.config.ts: Playwright configuration
- playwright-report/: generated HTML reports
- test-results/: failure artifacts and traces

## How MFA Works In This Test

The test uses the otpauth package to generate a TOTP code locally from the shared secret configured on the Heroku account.

The TOTP generator is configured with:

- algorithm: SHA1
- digits: 6
- period: 30 seconds
- secret: loaded from HEROKU_OTP_SECRET

Because the code is generated locally, the test does not need to read email, SMS, or authenticator app notifications during execution.

## Prerequisites

Before running the test, make sure you have:

- A Heroku account with MFA enabled
- The Heroku account email address
- The Heroku account password
- The MFA shared secret used by your authenticator app
- Node.js installed
- Playwright browsers installed

## Installation

Install project dependencies:

```powershell
npm install
```

Install Playwright browsers:

```powershell
npx playwright install
```

## Environment Variables

The test expects these environment variables:

- HEROKU_EMAIL
- HEROKU_PASSWORD
- HEROKU_OTP_SECRET

Set them in PowerShell for the current terminal session:

```powershell
$env:HEROKU_EMAIL = "your-email@example.com"
$env:HEROKU_PASSWORD = "your-password"
$env:HEROKU_OTP_SECRET = "your-totp-secret"
```

If you want them to persist for future PowerShell sessions, use:

```powershell
setx HEROKU_EMAIL "your-email@example.com"
setx HEROKU_PASSWORD "your-password"
setx HEROKU_OTP_SECRET "your-totp-secret"
```

After using setx, open a new terminal before running Playwright.

## Running The Tests

Run all tests:

```powershell
npx playwright test
```

Run only the Heroku MFA test:

```powershell
npx playwright test tests/otp.spec.ts
```

Run with the Playwright UI:

```powershell
npx playwright test --ui
```

Open the HTML report:

```powershell
npx playwright show-report
```

## Current Playwright Configuration

The current Playwright configuration is set up to:

- use the tests directory as the test root
- generate an HTML report
- capture trace data on the first retry
- run Chromium by default

Firefox and WebKit entries are present in the configuration but currently commented out.

## Problems

### Test report displays the email and password. Credentials are revealed to someone who has access to the test-report
<img width="1005" height="1102" alt="image" src="https://github.com/user-attachments/assets/2e2c364b-4eb5-42d8-9e91-491a2645afeb" />

### Test trace also reveals the email and password used in logs
<img width="2205" height="1170" alt="image" src="https://github.com/user-attachments/assets/34325d88-cef3-4a70-a504-5dc4b1c8c354" />



## Notes And Limitations

- This test depends on live Heroku and Salesforce verification pages, so UI text, page structure, or redirect URL changes may require locator updates.
- Credentials and MFA secrets should not be hardcoded in the test file.
- Repeated failed sign-in attempts may trigger account lockout or additional security checks.
- The test currently assumes required environment variables are already set before execution.

## Possible Improvements

- Load secrets from a local .env file instead of setting shell variables manually
- Validate required environment variables before the test starts
- Make the OTP input locator more resilient if the MFA page markup changes
- Add a dedicated npm script for running the MFA login test


