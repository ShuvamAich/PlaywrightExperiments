# Playwright MCP Server

An end-to-end test automation project for the [Contact List App](https://thinking-tester-contact-list.herokuapp.com/), demonstrating an AI-assisted workflow where manual test cases were authored by Microsoft 365 Copilot and then automated using the Playwright MCP Server with GitHub Copilot (Claude Sonnet 4.6).

---

## 1. Manual Test Cases — Generated with Microsoft 365 Copilot

The manual test cases in [`tests/manualTestCase.md`](tests/manualTestCase.md) were created using **Microsoft 365 Copilot**. Six functional scenarios were identified and written in plain English:

| Test ID | Title |
|---------|-------|
| TC001 | Verify that the user can open the website successfully |
| TC002 | Verify that a new user can sign up |
| TC003 | Verify that a user can add a new contact |
| TC004 | Verify that a user can edit an existing contact |
| TC005 | Verify that a user can delete a contact |
| TC006 | Verify that a user can log out successfully |

Each test case includes preconditions, step-by-step actions, and expected results — making them ready to hand off to an automation tool.

![alt text](image.png)

---

## 2. Playwright MCP — Basics and Setup

### What is Playwright MCP?

**Playwright MCP** (Model Context Protocol) is a server that exposes Playwright browser automation capabilities as MCP tools. This allows AI assistants (such as GitHub Copilot) to directly control a real browser — navigating pages, clicking elements, filling forms, and reading page snapshots — in order to explore an application and write accurate automation code.

Key capabilities exposed by the server:
- `browser_navigate` — go to a URL
- `browser_snapshot` — capture an accessibility tree snapshot of the current page
- `browser_click` — click an element by reference
- `browser_fill_form` — fill one or more input fields
- `browser_handle_dialog` — accept or dismiss browser dialogs
- `browser_evaluate` — run JavaScript in the page context

### Setup

**Prerequisites:** Node.js 18+, VS Code with the GitHub Copilot extension.

1. **Install project dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

3. **Enable Playwright MCP in VS Code**

   Add the following to your VS Code `settings.json` (or `.vscode/mcp.json`):
   ```json
   {
     "mcp": {
       "servers": {
         "playwright": {
           "command": "npx",
           "args": ["@playwright/mcp@latest"]
         }
       }
     }
   }
   ```
   Reload VS Code — the MCP server will start automatically when GitHub Copilot needs it.

---

## 3. Generating Automation Tests with Playwright MCP + GitHub Copilot

### The Workflow

With the Playwright MCP server running, **GitHub Copilot (Claude Sonnet 4.6)** was prompted to:

> *"Use Playwright MCP Server and automate provided test cases. Navigate to the application in the browser, perform all steps of the test cases and create a new spec file in the tests folder."*

Copilot then autonomously:

1. **Navigated** to the live application using the MCP `browser_navigate` tool.
2. **Explored** each page (Login, Sign Up, Contact List, Add Contact, Edit Contact, Contact Details) by taking accessibility snapshots and reading the DOM structure with `browser_evaluate`.
3. **Executed** every manual test case step-by-step in the real browser to discover correct selectors, observe redirects, and identify application quirks.
4. **Generated** [`tests/contactList.spec.ts`](tests/contactList.spec.ts) — a fully working Playwright spec — based on what it observed.

### Technical Findings Handled Automatically

During live exploration, Copilot identified and resolved two non-obvious issues:

- **External Submit buttons** — Both the Add Contact and Edit Contact pages place the `<button type="submit">` *outside* the `<form>` element (linked via the HTML `form="..."` attribute). A plain `.click()` on such a button can fall back to a GET submission, breaking the test. Copilot fixed this by calling `form.requestSubmit()` via `page.evaluate()`, which reliably fires the form's `submit` event.

- **Async form pre-population** — The Edit Contact page fetches existing contact data asynchronously after load and writes it into the input fields. Without waiting, a `.fill()` call would be overwritten by the fetch response. Copilot added `page.waitForLoadState('networkidle')` before interacting with the form.

### Running the Tests

```bash
# Run all tests on Chromium
npx playwright test --project=chromium

# Run with visible browser
npx playwright test --project=chromium --headed

# View the HTML report
npx playwright show-report
```

All 6 tests pass in approximately 17 seconds on a single worker.

![alt text](image-1.png)

![alt text](image-2.png)

## Problems with this approach:

1. Tests generated were flaky.

To generate the email for the signup of user, at first the LLM generated `testuser_${Date.now()}@example.com` which continuously collided with parallel tests. Hence I manually replaced it with `testuser_${randomUUID().split('-')[0]}@example.com`

2. Took too much time to verify after generating the tests. 

The loop of refactoring and verifying almost went on endlessly and almost consumed 88.8K Tokens out of 200K tokens (44%)  

3. Manually had to change some url assertions.

This proves that there is still a need to have a human in the loop to understand and refactor the code generated and we cannot fully depend on the LLM to generate an accurate code. Sometimes, the debugging takes more time than generating the code. So we must consider the tradeoff between ai-generated code vs manual debugging of that code.

## References

1. https://thinking-tester-contact-list.herokuapp.com/
2. https://youtu.be/FGwtDhjnBMc?si=ASwO22b7R9Zzf00K - Artem Bondar
3. https://youtu.be/AaCj939XIQ4?si=3xib3_Cgl0XFNpV4 - Playwright
