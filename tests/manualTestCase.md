1. Test Case: Open the Website
Test ID: TC001
Title: Verify that the user can open the website successfully
Preconditions: User has a stable internet connection

Steps:

- Open browser 
- Enter the URL: https://thinking-tester-contact-list.herokuapp.com/.
- Press Enter.

Expected Result:

- Website loads successfully.
- Homepage or Login page is displayed without errors.


2. Test Case: Sign Up
Test ID: TC002
Title: Verify that a new user can sign up

Steps:

- Click “Sign Up”.
- Enter First Name.
- Enter Last Name.
- Enter Email ID (unique).
- Enter Password (min 8)
- Click “Submit”.

Expected Result:

- User account is created successfully.
- User is automatically logged in and redirected to Contact List page, OR a success message is shown.


3. Test Case: Add a New Contact
Test ID: TC003
Title: Verify that a user can add a new contact
Preconditions: User is logged in

Steps:

- Click “Add Contact”.
- Enter First Name.
- Enter Last Name.
- Enter Date of Birth (optional).
- Enter Phone Number.
- Enter Street Address.
- Enter City.
- Enter State.
- Enter Postal Code.
- Enter Country.
- Click “Submit”.

Expected Result:

- Contact is added successfully.
- The new contact appears in the Contact List.


4. Test Case: Edit an Existing Contact
Test ID: TC004
Title: Verify that a user can edit an existing contact
Preconditions: At least one contact exists

Steps:

- Select an existing contact from the contact list.
- Click “Edit”.
- Modify any field (e.g., update phone number).
- Click “Save” (or Submit).

Expected Result:

- Contact details are updated successfully.
- Updated values appear correctly in the contact list.


5. Test Case: Delete a Contact
Test ID: TC005
Title: Verify that a user can delete a contact
Preconditions: At least one contact exists

Steps:

- Select an existing contact.
- Click “Delete”.
- Confirm the deletion in the popup (if any).

Expected Result:

- Contact is removed from the list.
- Confirmation message appears.
- Contact is no longer visible in the contact list.


6. Test Case: Logout
Test ID: TC006
Title: Verify that a user can log out successfully
Preconditions: User is logged in

Steps:

- Click the “Logout” button.

Expected Result:

- User is logged out.
- Login page / Homepage is displayed.