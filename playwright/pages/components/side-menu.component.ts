import type { Page, Locator } from '@playwright/test';

export class SideMenuComponent {
  readonly root: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.root = page.locator('.bm-menu-wrap');
    this.allItemsLink = this.root.getByTestId('inventory-sidebar-link');
    this.aboutLink = this.root.getByTestId('about-sidebar-link');
    this.logoutLink = this.root.getByTestId('logout-sidebar-link');
    this.closeButton = this.root.getByRole('button', { name: 'Close Menu' });
  }

  async goToAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async goToAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
