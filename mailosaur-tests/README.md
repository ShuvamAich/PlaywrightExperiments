<p>
<a href="https://mailosaur.com">
<img class="" height="24" width="165" alt="Mailosaur logo" src="https://mailosaur.com/images/logo-color-dark.svg">
</a>
</p>

# Getting Started

Visit [Mailosaur's website](https://mailosaur.com) to learn more about Mailosaur, create your own free trial and get started with email and SMS test automation.

<b>You only get 14 Days of free trial period</b>

## Documentation

Documentation can be found on [Mailosaur's site](https://mailosaur.com/docs).

We also have specific documentation for [Playwright](https://mailosaur.com/docs/frameworks-and-tools/playwright) on [email testing](https://mailosaur.com/docs/email-testing/playwright) and [SMS testing](https://mailosaur.com/docs/sms-testing/playwright).

As well as documentation for [Node.js](https://mailosaur.com/docs/languages/nodejs).

## Running Tests

You can run all the example tests included in this project using `npm`:

```
npm run test
```

> [!NOTE]  
> Where a test depends on a feature that may not yet be enabled on your account, the test is skipped by default.

# What's Included

This project includes examples for many common test scenarios:

## Reset a password using email - `passwordReset.spec.js`

Shows you how to perform an automated test for a password reset workflow:

```
npx playwright test passwordReset.spec.js
```

1. Creates a unique, random email address for the test case.

2. Navigates to the [Mailosaur example site](https://example.mailosaur.com/password-reset), which has a mock password reset form.

3. Uses browser automation to submit a password reset request for the email address.

4. Uses the Mailosaur API to wait for a new email to arrive at the given email address.

5. Asserts that the email received is the expected one.

6. Navigates to the link found in the email.

7. Completes the password reset process by setting a new password.


## Multi-Factor Authentication (MFA) via Email - `otpEmail.spec.js`

Shows you how to perform an automated test for a workflow that sends a one-time password (OTP) via email:

```
npx playwright test otpEmail.spec.js
```

1. Creates a unique, random email address for the test case.

2. Navigates to the [Mailosaur example site](https://example.mailosaur.com/otp), which has a form that sends an email containing a one-time password (OTP).

3. Uses browser automation to submit this form.

4. Uses the Mailosaur API to wait for a new email to arrive at the given email address.

5. Asserts that the email received is the expected one.

6. Grabs the one-time password (OTP).

7. Logs the OTP value. Once you have this working, you would change this to an assertion.

# Quickstart Guide

<b> Reference: </b> https://mailosaur.com/docs/automation/playwright/quickstart

### Prerequisites
1. A Mailosaur account or free trial account.
2. An API key generated in your account.

### Generate a sample test

```
npm create mailosaur@latest
```

This gives you a simple Playwright project with Mailosaur pre-configured, along with some basic tests.

It prompts you to choose:
1. Project Name
2. Testing Framework (Playwright, cypress, Selenium, etc.)
3. Language (Node.js, .NET)
4. Create Sample Tests
5. Mailosaur API Key
6. Mailosaur Server ID
7. Install Test Dependencies


