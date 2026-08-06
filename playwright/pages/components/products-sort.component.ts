import type { Page, Locator } from '@playwright/test';

export class ProductsSortComponent {
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  private async getCurrentSortValue(): Promise<string | null> {
    return await this.sortDropdown.inputValue();
  }

  async sortBy(option: 'lohi' | 'hilo' | 'az' | 'za'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getCurrentSortLabel(): Promise<string | null> {
    const currentSortValue: string | null = await this.getCurrentSortValue();
    if (!currentSortValue) return null;
    return await this.sortDropdown.locator(`option[value='${currentSortValue}']`).textContent();
  }
}
