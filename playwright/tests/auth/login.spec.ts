import { test, expect } from '../../fixtures/fixtures.js';
import users from '../../data/users.json' with { type: 'json' };

// Feature: Login

test.use({ storageState: undefined });

type LoginButtonState = { name: string; username: string; password: string };
type ErrorScenario = { name: string; username: string; password: string; expectedError: string };

test.describe('Login', { tag: '@regression' }, () => {
  // Rule: Form inputs accept user data
  test.describe('Form elements', () => {
    // Background:
    //   Given the user is on the login page

    test('accepts input in the username field', async ({ loginPage }) => {
      // When the user types in the username field
      await loginPage.fillUsername(users.standard.username);

      // Then the username field displays the typed text
      await expect(loginPage.usernameInput).toHaveValue(users.standard.username);
    });

    test('accepts input in the password field', async ({ loginPage }) => {
      // When the user types in the password field
      await loginPage.fillPassword(users.standard.password);

      // Then the password field displays the typed text
      await expect(loginPage.passwordInput).toHaveValue(users.standard.password);
    });

    test.describe('Login button', () => {
      const states: LoginButtonState[] = [
        { name: 'fields are empty', username: '', password: '' },
        { name: 'only username is filled', username: users.standard.username, password: '' },
        { name: 'only password is filled', username: '', password: users.standard.password },
        { name: 'both fields are filled', username: users.standard.username, password: users.standard.password },
      ];

      // Scenario Outline: login button is enabled regardless of field state
      for (const state of states) {
        test(`is enabled when ${state.name}`, async ({ loginPage }) => {
          // When the user fills the fields
          if (state.username) await loginPage.fillUsername(state.username);
          if (state.password) await loginPage.fillPassword(state.password);

          // Then the login button is enabled
          await expect(loginPage.loginButton).toBeEnabled();
        });
      }
    });
  });

  // Rule: Authentication validates credentials before granting access
  test.describe('Authentication', { tag: '@smoke' }, () => {
    // Background:
    //   Given the user is on the login page

    const errorScenarios: ErrorScenario[] = [
      {
        name: 'username is missing',
        username: '',
        password: users.standard.password,
        expectedError: 'Username is required',
      },
      {
        name: 'password is missing',
        username: users.standard.username,
        password: '',
        expectedError: 'Password is required',
      },
      {
        name: 'credentials are invalid',
        username: users.invalid.username,
        password: users.invalid.password,
        expectedError: 'Username and password do not match',
      },
      {
        name: 'user is locked out',
        username: users.lockedOut.username,
        password: users.lockedOut.password,
        expectedError: 'Sorry, this user has been locked out',
      },
    ];

    // Scenario Outline: login fails with various invalid credential combinations
    for (const scenario of errorScenarios) {
      test(`shows an error when ${scenario.name}`, async ({ loginPage }) => {
        // When the user submits the form with invalid credentials
        if (scenario.username) await loginPage.fillUsername(scenario.username);
        if (scenario.password) await loginPage.fillPassword(scenario.password);
        await loginPage.submit();

        // Then an error message is displayed
        await expect(loginPage.errorMessage).toContainText(scenario.expectedError);
      });
    }

    test('redirects to the inventory page with valid credentials', async ({ loginPage, page }) => {
      // When the user logs in with valid credentials
      await loginPage.login(users.standard);

      // Then the user is redirected to the inventory page
      await expect(page).toHaveURL(/inventory\.html$/);
    });
  });
});
