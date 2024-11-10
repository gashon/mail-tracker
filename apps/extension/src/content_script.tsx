import { AnalyticsClient } from '@mail/extension/utils/api';
import { EmailTracker } from '@mail/extension/utils/dom-utils';
import { GmailObserver } from '@mail/extension/utils/observers';

const API_BASE_URL = 'https://3c9e-171-64-77-63.ngrok-free.app';

const api = new AnalyticsClient(API_BASE_URL);
const emailTracker = new EmailTracker(api);
const observer = new GmailObserver((composeWindow) => {
  emailTracker.handleNewEmail(composeWindow);
});

observer.startObserving();
