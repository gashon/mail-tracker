import {
  PromotedActivitiesFilterSingleton,
  LanguageModelFilterSingleton,
} from "@/utils/dom-utils";
import { LanguageModelFilter, RequestMessage } from "@/consts";

const promotedActivitiesFilter = new PromotedActivitiesFilterSingleton();
promotedActivitiesFilter.init();

const languageModelFilter = new LanguageModelFilterSingleton(
  // TODO support reading and writing options to storage for persistence
  {
    apiKey: "TODO",
    filters: [LanguageModelFilter.RECRUITING_FILTER],
    userDefinedFilters: ["TODO"],
  }
);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === RequestMessage.PROMOTION_FILTER_COUNT) {
    const count = promotedActivitiesFilter.getRemovedCount();
    sendResponse({ count });
    return true;
  } else if (message.type === RequestMessage.LANGUAGE_MODEL_FILTER) {
    const count = languageModelFilter.getRemovedCount();
    sendResponse({ count });
    return true;
  }
});
