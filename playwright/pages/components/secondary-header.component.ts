import type { Page, Locator } from '@playwright/test';

export class SecondaryHeaderComponent {
  readonly root: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('secondary-header');
    this.title = this.root.getByTestId('title');
  }

  async getTitle(): Promise<string> {
    return await this.title.innerText();
  }
}
