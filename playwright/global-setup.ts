import { chromium } from '@playwright/test';
import users from './data/users.json' with { type: 'json' };

export default async function globalSetup(): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: 'https://www.saucedemo.com' });
  const page = await context.newPage();

  await page.goto('/');
  await page.locator('[data-test="username"]').fill(users.standard.username);
  await page.locator('[data-test="password"]').fill(users.standard.password);
  await page.locator('[data-test="login-button"]').click();
  await page.waitForURL('**/inventory.html');

  const cookies = await context.cookies();
  if (!cookies.some(c => c.name === 'session-username')) {
    throw new Error('globalSetup: login failed — session cookie not found in context');
  }

  await context.storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
}
