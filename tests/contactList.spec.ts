import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { generateRandomEmail, generateRandomPassword } from '../utils/helperFunctions';

let authToken = '';
let apiContext: APIRequestContext;

const email = generateRandomEmail();
const password = generateRandomPassword();
const setupToken = process.env.CONTACT_LIST_API_TOKEN;

test.beforeAll('create user',async () => {
    apiContext = await playwrightRequest.newContext();
    expect(setupToken, 'Set CONTACT_LIST_API_TOKEN before running this suite').toBeTruthy();

  const response = await apiContext.post('https://thinking-tester-contact-list.herokuapp.com/users', {
    headers:{
      Authorization: `Bearer ${setupToken}`
    },
    data: {
      "firstName": "Test",
      "lastName": "User",
      "email": email,
      "password": password
    }
    });
    console.log('###### Creating user ######');
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    console.log(responseBody);
    authToken = responseBody.token; // capture generated token for later use
    console.log(`Created user with email: ${email} and password: ${password}`);
    console.log(`Captured token: ${authToken}`);
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test.describe('Contact List API Tests', () => {
 test.describe.configure({ mode: 'serial' }); // Ensure tests run in sequence to maintain state and not in parallel to prevent token conflicts
test('get user profile', async ({ request }) => {
  const response = await request.get('https://thinking-tester-contact-list.herokuapp.com/users/me', {
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log('###### Retrieving user profile ######');
  console.log(`Auth token used for profile retrieval: ${authToken}`);
  const responseBody = await response.json();
  console.log(responseBody);
  expect(response.status()).toBe(200);          
  expect(responseBody.firstName).toBe('Test');  
  expect(responseBody.lastName).toBe('User');
  expect(responseBody.email).toBe(email);
});

test('update user profile', async ({ request }) => {
  const response = await request.patch('https://thinking-tester-contact-list.herokuapp.com/users/me', {
    headers:{
      Authorization: `Bearer ${authToken}`
    },
    data: {
      "firstName": "Updated Test",
      "lastName": "User",
      "email": email,
      "password": password
    }
  });
  console.log('###### Updating user profile ######');
  console.log(`Auth token used for profile update: ${authToken}`);
  const responseBody = await response.json();
  console.log(responseBody);
  expect(response.status()).toBe(200);          
  expect(responseBody.firstName).toBe('Updated Test');  
  expect(responseBody.lastName).toBe('User');
  expect(responseBody.email).toBe(email);
});

test('add a contact', async ({ request }) => {
  const response = await request.post('https://thinking-tester-contact-list.herokuapp.com/contacts', {
    headers:{
      Authorization: `Bearer ${authToken}`
    },
    data: {
    "firstName": "Firstname Tester",
    "lastName": "Lastname Tester",
    "birthdate": "2000-12-01",
    "email": "example@email.com",
    "phone": "8975462130",
    "street1": "Zero Avenue",
    "city": "Chicago",
    "stateProvince": "Delhi",
    "postalCode": "75412",
    "country": "Canada",
    }
  });
    console.log('###### Adding a contact ######');
    console.log(`Auth token used for adding contact: ${authToken}`);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.status()).toBe(201);
});

test('get contact list', async ({ request }) => {
  const response = await request.get('https://thinking-tester-contact-list.herokuapp.com/contacts', {
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log('###### Retrieving contact list ######');
  console.log(`Auth token used for contact list retrieval: ${authToken}`);
  const responseBody = await response.json();
  console.log(responseBody);
  expect(response.status()).toBe(200);          
  expect(responseBody[0].firstName).toBe('Firstname Tester');  
  expect(responseBody[0].lastName).toBe('Lastname Tester');
  expect(responseBody[0].email).toBe('example@email.com');
});

test('update contact', async ({ request }) => {
  const response = await request.get('https://thinking-tester-contact-list.herokuapp.com/contacts', {
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  });
  expect(response.status()).toBe(200);  
  const responseBody = await response.json();
  const contact = responseBody.find((c: any) => c.firstName === 'Firstname Tester');
  expect(contact).toBeTruthy();

  const contactId = contact._id; // capture id of contact for update
   const updatePUTResponse = await request.put(`https://thinking-tester-contact-list.herokuapp.com/contacts/${contactId}`, {
    headers:{
      Authorization: `Bearer ${authToken}`
    },
    data: {
      "firstName": "Updated Firstname",
      "lastName": "Updated Lastname",
      "birthdate": "2000-12-01",
      "email": "example@email.com",
      "phone": "8975462130",
      "street1": "Zero Avenue",
      "city": "Chicago",
      "stateProvince": "Delhi",
      "postalCode": "75412",
      "country": "Canada"
    }
  });
  console.log('###### Updating contact PUT Method######');
  console.log(`Auth token used for contact list retrieval: ${authToken}`);
  const updatePUTResponseBody = await updatePUTResponse.json();
  console.log(updatePUTResponseBody);
  expect(updatePUTResponse.status()).toBe(200);          
  expect(updatePUTResponseBody.firstName).toBe('Updated Firstname');  
  expect(updatePUTResponseBody.lastName).toBe('Updated Lastname');

  const updatePATCHResponse = await request.patch(`https://thinking-tester-contact-list.herokuapp.com/contacts/${contactId}`, {
    headers:{
      Authorization: `Bearer ${authToken}`
    },
    data: {
      "email": "updated@email.com",
    }
  });
  console.log('###### Updating contact PATCH Method######');
  console.log(`Auth token used for contact list retrieval: ${authToken}`);
  const updatePATCHResponseBody = await updatePATCHResponse.json();
  console.log(updatePATCHResponseBody);
  expect(updatePATCHResponse.status()).toBe(200); 
  expect(updatePATCHResponseBody.email).toBe('updated@email.com');
});

test('delete contact', async ({ request }) => {
  const response = await request.get('https://thinking-tester-contact-list.herokuapp.com/contacts', {
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  });
  expect(response.status()).toBe(200);  
  const responseBody = await response.json();
  const contact = responseBody.find((c: any) => c.firstName === 'Updated Firstname');
  expect(contact).toBeTruthy();

  const contactId = contact._id; // capture id of contact for update // capture id of contact for update
  const deleteResponse = await request.delete(`https://thinking-tester-contact-list.herokuapp.com/contacts/${contactId}`, {
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log('###### Deleting contact ######');
  console.log(`Auth token used for contact list retrieval: ${authToken}`);
  expect(deleteResponse.status()).toBe(200);  
});

test('logout user profile', async ({ request }) => {
  const response = await request.post('https://thinking-tester-contact-list.herokuapp.com/users/logout', {
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  });
  console.log('###### Logging out user profile ######');
  console.log(`Auth token used for logout: ${authToken}`);
});

test('login and delete user profile', async ({ request }) => {
  const response = await request.post('https://thinking-tester-contact-list.herokuapp.com/users/login', {
    headers:{
    },
    data: {
      "email": email,
      "password": password
    }
  });
  console.log('###### Logging in user profile ######');
  console.log(`Auth token used for login: ${authToken}`);
  const responseBody = await response.json();
  console.log(responseBody);
  expect(response.status()).toBe(200); 

  const newAuthToken = responseBody.token;
  expect(newAuthToken).toBeTruthy();
  console.log(`New token received on login: ${newAuthToken}`);

  const deleteResponse = await request.delete('https://thinking-tester-contact-list.herokuapp.com/users/me', {
    headers:{
      Authorization: `Bearer ${newAuthToken}`  
    }
  });
  console.log('###### Deleting user profile ######');
  console.log(`Auth token used for deleting user profile: ${newAuthToken}`);
  expect(deleteResponse.status()).toBe(200);

});
});