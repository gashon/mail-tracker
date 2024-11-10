import { GMAIL_SELECTORS } from '@mail/extension/consts';
import { logger } from '@mail/extension/lib/logger';
import { AnalyticsClient } from '@mail/extension/utils/api';
import type { EmailMetadata, PixelConfig } from '@mail/extension/types';

export class EmailTracker {
  private api: AnalyticsClient;

  constructor(api: AnalyticsClient) {
    this.api = api;
  }

  async handleNewEmail(composeWindow: HTMLElement) {
    const sendButton = composeWindow.querySelector(
      GMAIL_SELECTORS.SEND_BUTTON
    ) as HTMLElement;
    if (!sendButton) return;

    sendButton.addEventListener('click', async (e) => {
      try {
        const metadata = this.getEmailMetadata(composeWindow);
        const pixelData = await this.api.createPixel(metadata);
        await this.insertTrackingPixel(composeWindow, pixelData);
      } catch (error) {
        console.error('Failed to initialize tracking:', error);
      }
    });
  }

  private getEmailMetadata(composeWindow: HTMLElement): EmailMetadata {
    const recipients = this.getRecipients(composeWindow);
    const subject = this.getSubject(composeWindow);

    return {
      to: recipients,
      subject,
      timestamp: Date.now(),
      pixelId: crypto.randomUUID(),
    };
  }

  private getRecipients(composeWindow: HTMLElement): string[] {
    const recipientInput = composeWindow.querySelector(
      GMAIL_SELECTORS.RECIPIENTS_INPUT
    ) as HTMLInputElement;
    return recipientInput?.value.split(',').map((email) => email.trim()) || [];
  }

  private getSubject(composeWindow: HTMLElement): string {
    const subjectInput = composeWindow.querySelector(
      GMAIL_SELECTORS.SUBJECT_INPUT
    ) as HTMLInputElement;
    return subjectInput?.value || '';
  }

  private async insertTrackingPixel(
    composeWindow: HTMLElement,
    pixelData: PixelConfig
  ) {
    const bodyDiv = composeWindow.querySelector(GMAIL_SELECTORS.EMAIL_BODY);
    if (!bodyDiv) return;

    const img = document.createElement('img');
    img.src = pixelData.url;
    img.style.position = 'absolute';
    img.style.opacity = '0';
    img.style.width = '1px';
    img.style.height = '1px';
    img.setAttribute('data-pixel-id', pixelData.id);

    bodyDiv.appendChild(img);
  }
}
