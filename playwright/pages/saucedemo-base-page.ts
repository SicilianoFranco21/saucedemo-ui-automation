import type { Page } from '@playwright/test';
import { BasePage } from './base-page.js';
import { HeaderComponent } from './components/header.component.js';
import { SecondaryHeaderComponent } from './components/secondary-header.component.js';
import { SideMenuComponent } from './components/side-menu.component.js';
import { FooterComponent } from './components/footer.component.js';

export abstract class SauceDemoBasePage extends BasePage {
  readonly header: HeaderComponent;
  readonly secondaryHeader: SecondaryHeaderComponent;
  readonly sideMenu: SideMenuComponent;
  readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.secondaryHeader = new SecondaryHeaderComponent(page);
    this.sideMenu = new SideMenuComponent(page);
    this.footer = new FooterComponent(page);
  }
}
