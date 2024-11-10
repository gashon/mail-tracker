import { AnalyticsClient } from '@mail/extension/utils/api';
import { EmailTracker } from '@mail/extension/utils/dom-utils';
import { GmailObserver } from '@mail/extension/utils/observers';

const API_BASE_URL = 'http://localhost:3000';

const api = new AnalyticsClient(API_BASE_URL);
const emailTracker = new EmailTracker(api);
const observer = new GmailObserver((composeWindow) => {
  emailTracker.handleNewEmail(composeWindow);
});

observer.startObserving();
