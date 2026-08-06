import type { Page, Locator } from '@playwright/test';

export class FooterComponent {
  readonly root: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;
  readonly footerText: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('footer');
    this.twitterLink = this.root.getByTestId('social-twitter');
    this.facebookLink = this.root.getByTestId('social-facebook');
    this.linkedinLink = this.root.getByTestId('social-linkedin');
    this.footerText = this.root.getByTestId('footer-copy');
  }

  async goToTwitter(): Promise<void> {
    await this.twitterLink.click();
  }

  async goToFacebook(): Promise<void> {
    await this.facebookLink.click();
  }

  async goToLinkedin(): Promise<void> {
    await this.linkedinLink.click();
  }

  async footerCopy(): Promise<string> {
    return await this.footerText.innerText();
  }
}
