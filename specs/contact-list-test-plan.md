# Contact List App — Test Plan

## Application Overview

The Contact List App (https://thinking-tester-contact-list.herokuapp.com) is a single-page web application for managing personal contacts. It provides user registration and login functionality, and once authenticated, users can add, view, edit, and delete contacts. The application navigates through six main pages: the Login page (/), the Registration page (/addUser), the Contact List page (/contactList), the Add Contact page (/addContact), the Contact Details page (/contactDetails), and the Edit Contact page (/editContact). The app is intended for testing purposes only.

## Test Scenarios

### 1. User Registration

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful registration with valid details

**File:** `specs/registration/registration-all-fields.spec.ts`

**Steps:**
  1. Navigate to https://thinking-tester-contact-list.herokuapp.com
    - expect: The login page is displayed with a heading 'Contact List App'
    - expect: Email and Password fields are visible
    - expect: A 'Sign up' button is present
  2. Click the 'Sign up' button
    - expect: The page navigates to /addUser
    - expect: The 'Add User' form is shown with First Name, Last Name, Email, and Password fields
    - expect: Submit and Cancel buttons are visible
  3. Fill in 'First Name' with 'Test', 'Last Name' with 'User', 'Email' with a unique valid email address (e.g. testuser_unique@example.com), and 'Password' with 'Password1!'
  4. Click 'Submit'
    - expect: The user is redirected to /contactList
    - expect: The Contact List page is displayed with a 'Logout' button and an 'Add a New Contact' button
    - expect: The contact table is empty

#### 1.2. Registration fails when all required fields are left blank

**File:** `specs/registration/registration-missing-fields.spec.ts`

**Steps:**
  1. Navigate to https://thinking-tester-contact-list.herokuapp.com and click 'Sign up'
    - expect: The Add User registration form is displayed
  2. Leave all fields blank and click 'Submit'
    - expect: An error message is displayed indicating that required fields are missing
    - expect: The user is not redirected away from /addUser

#### 1.3. Registration fails when email is already registered

**File:** `specs/registration/registration-duplicate-email.spec.ts`

**Steps:**
  1. Navigate to /addUser by clicking 'Sign up' on the login page
    - expect: The Add User form is displayed
  2. Fill in valid First Name, Last Name, and Password, but enter an email address that has already been registered, then click 'Submit'
    - expect: An error message is displayed indicating the email is already in use
    - expect: The user remains on the /addUser page and is not logged in

#### 1.4. Clicking Cancel on the registration form returns to the login page

**File:** `specs/registration/registration-cancel.spec.ts`

**Steps:**
  1. Navigate to /addUser by clicking 'Sign up' on the login page
    - expect: The Add User form is displayed
  2. Fill in some fields (do not submit) then click 'Cancel'
    - expect: The user is navigated back to the login page at /
    - expect: No account is created

### 2. User Login

**Seed:** `tests/seed.spec.ts`

#### 2.1. Successful login with valid credentials

**File:** `specs/login/login-valid-credentials.spec.ts`

**Steps:**
  1. Navigate to https://thinking-tester-contact-list.herokuapp.com
    - expect: The login page is displayed with a 'Log In:' section
    - expect: Email and Password fields are present alongside a Submit button
  2. Fill in the Email field with a valid registered email address and the Password field with the corresponding password
  3. Click 'Submit'
    - expect: The user is redirected to /contactList
    - expect: The page title is 'My Contacts'
    - expect: A 'Logout' button and 'Add a New Contact' button are visible

#### 2.2. Login fails with an incorrect password

**File:** `specs/login/login-wrong-password.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: The login page is displayed
  2. Enter a valid registered email address and an incorrect password, then click 'Submit'
    - expect: An error message is displayed indicating incorrect credentials
    - expect: The user remains on the login page at /

#### 2.3. Login fails with an unregistered email address

**File:** `specs/login/login-unregistered-email.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: The login page is displayed
  2. Enter an email address that has not been registered along with any password, then click 'Submit'
    - expect: An error message is displayed
    - expect: The user is not redirected and remains on the login page at /

#### 2.4. Login fails when both fields are left empty

**File:** `specs/login/login-empty-fields.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: The login page is displayed
  2. Leave the Email and Password fields empty and click 'Submit'
    - expect: An error message is displayed
    - expect: The user is not redirected and remains on the login page at /

#### 2.5. Logout navigates the user back to the login page

**File:** `specs/login/logout.spec.ts`

**Steps:**
  1. Log in with valid credentials so the contact list page is displayed
    - expect: The Contact List page at /contactList is visible with a 'Logout' button
  2. Click the 'Logout' button
    - expect: The user is redirected to the login page at /
    - expect: The Email and Password fields are displayed
    - expect: The contact list is no longer accessible without re-authenticating

### 3. Contact List

**Seed:** `tests/seed.spec.ts`

#### 3.1. Contact list page displays correct layout after login

**File:** `specs/contact-list/contact-list-page-layout.spec.ts`

**Steps:**
  1. Log in with valid credentials
    - expect: The user is on the Contact List page at /contactList
  2. Observe the page layout
    - expect: A heading 'Contact List' is displayed in the banner
    - expect: A 'Logout' button is present in the header
    - expect: The instruction text 'Click on any contact to view the Contact Details' is visible
    - expect: An 'Add a New Contact' button is present
    - expect: A contact table is displayed with the column headers: Name, Birthdate, Email, Phone, Address, City/State/Province/Postal Code, Country

#### 3.2. Contact list table is empty for a new user account

**File:** `specs/contact-list/contact-list-empty-state.spec.ts`

**Steps:**
  1. Register a fresh account and log in
    - expect: The Contact List page is displayed
  2. Observe the contact table
    - expect: The table header row is displayed
    - expect: No data rows are present in the table body

#### 3.3. Clicking a contact row navigates to the Contact Details page

**File:** `specs/contact-list/contact-list-row-click.spec.ts`

**Steps:**
  1. Log in with an account that has at least one contact in the list
    - expect: The Contact List page is displayed and shows at least one contact row
  2. Click on the contact row
    - expect: The user is navigated to /contactDetails
    - expect: The Contact Details page heading is displayed
    - expect: All the contact's saved fields are shown

#### 3.4. Newly added contact appears in the contact list

**File:** `specs/contact-list/contact-list-shows-added-contact.spec.ts`

**Steps:**
  1. Log in and click 'Add a New Contact', fill all fields, then click Submit
    - expect: The user is returned to the Contact List page at /contactList
  2. Observe the contact table
    - expect: The newly added contact appears as a row in the table with Name, Birthdate, Email, Phone, Address, and Country values populated

### 4. Add Contact

**Seed:** `tests/seed.spec.ts`

#### 4.1. Successfully add a contact with all fields filled

**File:** `specs/add-contact/add-contact-all-fields.spec.ts`

**Steps:**
  1. Log in and click 'Add a New Contact'
    - expect: The Add Contact page at /addContact is displayed
    - expect: Fields visible: * First Name, * Last Name, Date of Birth, Email, Phone, Street Address 1, Street Address 2, City, State or Province, Postal Code, Country
    - expect: Submit and Cancel buttons are present
  2. Fill in all fields: First Name 'Jane', Last Name 'Smith', Date of Birth '1990-01-15', Email 'jane.smith@example.com', Phone '8005553535', Street Address 1 '123 Main St', Street Address 2 'Apt 4B', City 'Anytown', State or Province 'CA', Postal Code '12345', Country 'USA'
  3. Click 'Submit'
    - expect: The user is redirected to the Contact List page at /contactList
    - expect: The new contact 'Jane Smith' is visible as a row in the table
    - expect: The row displays the correct Birthdate, Email, Phone, Address, and Country values

#### 4.2. Successfully add a contact with only the required fields

**File:** `specs/add-contact/add-contact-required-only.spec.ts`

**Steps:**
  1. Log in and click 'Add a New Contact'
    - expect: The Add Contact form is displayed
  2. Fill in only First Name and Last Name (e.g. 'John' and 'Doe'), leave all other fields blank, then click 'Submit'
    - expect: The user is redirected to the Contact List page
    - expect: The new contact 'John Doe' appears as a row in the table
    - expect: Optional field columns for this contact are empty

#### 4.3. Add contact fails when First Name and Last Name are missing

**File:** `specs/add-contact/add-contact-missing-required.spec.ts`

**Steps:**
  1. Log in and click 'Add a New Contact'
    - expect: The Add Contact form is displayed
  2. Leave First Name and Last Name blank, fill in optional fields, and click 'Submit'
    - expect: An error message is displayed indicating required fields are missing
    - expect: The user is not redirected away from /addContact

#### 4.4. Add contact fails with an invalid Date of Birth format

**File:** `specs/add-contact/add-contact-invalid-dob-format.spec.ts`

**Steps:**
  1. Log in and click 'Add a New Contact'
    - expect: The Add Contact form is displayed
  2. Fill in the required First Name and Last Name fields, enter an invalid Date of Birth (e.g. '15/01/1990' or 'notadate'), and click 'Submit'
    - expect: An error message is displayed indicating that the date format is invalid (expected format: yyyy-MM-dd)
    - expect: The user is not redirected away from /addContact

#### 4.5. Cancelling the Add Contact form returns to the Contact List without saving

**File:** `specs/add-contact/add-contact-cancel.spec.ts`

**Steps:**
  1. Log in and click 'Add a New Contact'
    - expect: The Add Contact form is displayed
  2. Fill in several fields including First Name and Last Name, then click 'Cancel'
    - expect: The user is returned to the Contact List page at /contactList
    - expect: No new contact row has been added to the table

### 5. Contact Details

**Seed:** `tests/seed.spec.ts`

#### 5.1. Contact details page displays all saved field values

**File:** `specs/contact-details/contact-details-display.spec.ts`

**Steps:**
  1. Log in, add a contact with all fields filled, and click that contact's row in the list
    - expect: The Contact Details page at /contactDetails is displayed
    - expect: The heading 'Contact Details' is shown in the banner
  2. Observe all displayed information
    - expect: The page shows: First Name, Last Name, Date of Birth, Email, Phone, Street Address 1, Street Address 2, City, State or Province, Postal Code, Country — each with their saved values
    - expect: Buttons 'Edit Contact', 'Delete Contact', and 'Return to Contact List' are present

#### 5.2. 'Return to Contact List' navigates back to /contactList

**File:** `specs/contact-details/contact-details-return.spec.ts`

**Steps:**
  1. Log in and navigate to a contact's detail page by clicking a row in the contact list
    - expect: The Contact Details page is displayed
  2. Click 'Return to Contact List'
    - expect: The user is navigated to /contactList
    - expect: The Contact List page with its table and 'Add a New Contact' button is displayed

### 6. Edit Contact

**Seed:** `tests/seed.spec.ts`

#### 6.1. Edit Contact form displays pre-populated values

**File:** `specs/edit-contact/edit-contact-page-layout.spec.ts`

**Steps:**
  1. Log in and navigate to a contact's detail page, then click 'Edit Contact'
    - expect: The Edit Contact page at /editContact is displayed
    - expect: All fields (First Name, Last Name, Date of Birth, Email, Phone, Street Address 1, Street Address 2, City, State or Province, Postal Code, Country) are present and pre-populated with the contact's existing values
    - expect: Submit and Cancel buttons are visible

#### 6.2. Successfully updating a contact's fields saves the new values

**File:** `specs/edit-contact/edit-contact-update-fields.spec.ts`

**Steps:**
  1. Log in and navigate to the Edit Contact form for an existing contact
    - expect: The Edit Contact form is displayed with pre-populated values
  2. Change the First Name field to 'UpdatedName' and the City field to 'UpdatedCity', then click 'Submit'
    - expect: The user is redirected to the Contact Details page at /contactDetails
    - expect: The First Name now displays 'UpdatedName'
    - expect: The City now displays 'UpdatedCity'
    - expect: All other unchanged fields still display their original values

#### 6.3. Edit contact fails when required name fields are cleared

**File:** `specs/edit-contact/edit-contact-missing-required.spec.ts`

**Steps:**
  1. Log in and navigate to the Edit Contact form for an existing contact
    - expect: The Edit Contact form is displayed
  2. Clear both the First Name and Last Name fields, then click 'Submit'
    - expect: An error message is displayed
    - expect: The user is not navigated away from /editContact
    - expect: The contact's data is not altered

#### 6.4. Cancelling an edit discards changes and returns to Contact Details

**File:** `specs/edit-contact/edit-contact-cancel.spec.ts`

**Steps:**
  1. Log in and navigate to the Edit Contact form for an existing contact, noting the original First Name value
    - expect: The Edit Contact form is displayed with the contact's values
  2. Change the First Name to a different value, then click 'Cancel' without submitting
    - expect: The user is returned to the Contact Details page at /contactDetails
    - expect: The First Name still shows the original value — the change was not saved

### 7. Delete Contact

**Seed:** `tests/seed.spec.ts`

#### 7.1. Successfully deleting a contact removes it from the list

**File:** `specs/delete-contact/delete-contact-success.spec.ts`

**Steps:**
  1. Log in and ensure at least one contact exists. Navigate to that contact's detail page
    - expect: The Contact Details page is displayed
    - expect: A 'Delete Contact' button is visible
  2. Note the contact's name, then click 'Delete Contact'
    - expect: The user is redirected to the Contact List page at /contactList
    - expect: The previously noted contact no longer appears as a row in the contact table

#### 7.2. Deleting all contacts leaves the list empty

**File:** `specs/delete-contact/delete-all-contacts.spec.ts`

**Steps:**
  1. Log in with an account that has exactly one contact and navigate to that contact's detail page
    - expect: The Contact Details page is displayed
  2. Click 'Delete Contact'
    - expect: The user is redirected to /contactList
    - expect: The contact table body is empty — no rows are displayed

### 8. Navigation and Security

**Seed:** `tests/seed.spec.ts`

#### 8.1. Unauthenticated access to /contactList is blocked

**File:** `specs/security/unauthenticated-contact-list.spec.ts`

**Steps:**
  1. Without logging in, navigate directly to https://thinking-tester-contact-list.herokuapp.com/contactList
    - expect: The user is redirected to the login page at /
    - expect: The Contact List page content and contact data are not visible

#### 8.2. Unauthenticated access to /addContact is blocked

**File:** `specs/security/unauthenticated-add-contact.spec.ts`

**Steps:**
  1. Without logging in, navigate directly to https://thinking-tester-contact-list.herokuapp.com/addContact
    - expect: The user is redirected to the login page at /
    - expect: The Add Contact form is not accessible

#### 8.3. Unauthenticated access to /contactDetails is blocked

**File:** `specs/security/unauthenticated-contact-details.spec.ts`

**Steps:**
  1. Without logging in, navigate directly to https://thinking-tester-contact-list.herokuapp.com/contactDetails
    - expect: The user is redirected to the login page at /
    - expect: No contact information is displayed

#### 8.4. Unauthenticated access to /editContact is blocked

**File:** `specs/security/unauthenticated-edit-contact.spec.ts`

**Steps:**
  1. Without logging in, navigate directly to https://thinking-tester-contact-list.herokuapp.com/editContact
    - expect: The user is redirected to the login page at /
    - expect: The Edit Contact form is not displayed

#### 8.5. Each route displays the correct browser page title

**File:** `specs/navigation/page-titles.spec.ts`

**Steps:**
  1. Navigate to the login page and observe the browser tab title
    - expect: The page title is 'Contact List App'
  2. Log in and observe the title on /contactList
    - expect: The page title is 'My Contacts'
  3. Click 'Add a New Contact' and observe the title on /addContact
    - expect: The page title is 'Add Contact'
  4. Navigate back, click a contact row and observe the title on /contactDetails
    - expect: The page title is 'Contact Details'
  5. Click 'Edit Contact' and observe the title on /editContact
    - expect: The page title is 'Edit Contact'
  6. Click 'Sign up' from the login page and observe the title on /addUser
    - expect: The page title is 'Add User'
