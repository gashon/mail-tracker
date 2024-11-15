import { GMAIL_SELECTORS } from '@mail/extension/consts';
import { logger } from '@mail/extension/lib/logger';

export class GmailObserver {
  private composeObserver: MutationObserver;

  constructor(private onComposeDetected: (element: HTMLElement) => void) {
    this.composeObserver = new MutationObserver(
      this.handleMutations.bind(this)
    );
  }

  startObserving() {
    this.composeObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  stopObserving() {
    this.composeObserver.disconnect();
  }

  private handleMutations(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const composeWindows = document.querySelectorAll(
          GMAIL_SELECTORS.COMPOSE_WINDOW
        );
        composeWindows.forEach((window) => {
          if (!window.hasAttribute('data-tracking-initialized')) {
            window.setAttribute('data-tracking-initialized', 'true');
            setTimeout(() => {
              this.onComposeDetected(window as HTMLElement);
            }, 1000);
          }
        });
      }
    }
  }
}
