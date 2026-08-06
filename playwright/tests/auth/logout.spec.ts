import { test, expect } from '../../fixtures/fixtures.js';
import type { SauceDemoBasePage } from '../../pages/saucedemo-base-page.js';

// Feature: Logout

async function logout(pageObject: SauceDemoBasePage): Promise<void> {
  await pageObject.header.openMenu();
  await pageObject.sideMenu.logout();
}

test.describe('Logout', { tag: '@regression' }, () => {
  // Rule: User can log out from any authenticated page
  // Background:
  //   Given the user is logged in

  // Scenario Outline: logs out from <page>
  // | page                  |
  // | inventory page        |
  // | cart page             |
  // | checkout step one     |
  // | checkout step two     |
  // | checkout complete     |

  test('logs out from the inventory page', async ({ inventoryPage }) => {
    // Given the user is on the inventory page

    // When the user opens the menu and logs out
    await logout(inventoryPage);

    // Then the user is redirected to the login page
    await expect(inventoryPage.page).toHaveURL(/\/$/);
  });

  test('logs out from the cart page', async ({ cartPage }) => {
    // Given the user is on the cart page
    await cartPage.navigate();

    // When the user opens the menu and logs out
    await logout(cartPage);

    // Then the user is redirected to the login page
    await expect(cartPage.page).toHaveURL(/\/$/);
  });

  test('logs out from the checkout step one page', async ({ checkoutStepOnePage }) => {
    // Given the user is on the checkout step one page
    await checkoutStepOnePage.navigate();

    // When the user opens the menu and logs out
    await logout(checkoutStepOnePage);

    // Then the user is redirected to the login page
    await expect(checkoutStepOnePage.page).toHaveURL(/\/$/);
  });

  test('logs out from the checkout step two page', async ({ checkoutStepTwoPage }) => {
    // Given the user is on the checkout step two page
    await checkoutStepTwoPage.navigate();

    // When the user opens the menu and logs out
    await logout(checkoutStepTwoPage);

    // Then the user is redirected to the login page
    await expect(checkoutStepTwoPage.page).toHaveURL(/\/$/);
  });

  test('logs out from the checkout complete page', async ({ checkoutCompletePage }) => {
    // Given the user is on the checkout complete page
    await checkoutCompletePage.navigate();

    // When the user opens the menu and logs out
    await logout(checkoutCompletePage);

    // Then the user is redirected to the login page
    await expect(checkoutCompletePage.page).toHaveURL(/\/$/);
  });
});
